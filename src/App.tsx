import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import WalletConnect from "@walletconnect/client";
import { IInternalEvent } from "@walletconnect/types";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import * as React from "react";
import styled from "styled-components";
import AccountAssets from "./components/AccountAssets";
import Button from "./components/Button";
import Column from "./components/Column";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Modal from "./components/Modal";
import Wrapper from "./components/Wrapper";
import {
  apiGetAccountAssets,
  apiGetTxnParams,
  apiSubmitTransactions,
  ChainType
} from "./helpers/api";
import { IAssetData, IOperation, IWalletTransaction, SignTxnParams } from "./helpers/types";
import { Scenario, scenarios, signTxnWithTestAccount } from "./scenarios";
import { fonts } from "./styles";

const SLayout = styled.div`
  position: relative;
  width: 100%;
  /* height: 100%; */
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper as any)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SLanding = styled(Column as any)`
  height: 600px;
`;

const SButtonContainer = styled(Column as any)`
  width: 250px;
  margin: 50px 0;
`;

const SConnectButton = styled(Button as any)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  margin: 12px 0;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalButton = styled.button`
  margin: 1em 0;
  font-size: 18px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

// @ts-ignore
const SBalances = styled(SLanding as any)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

const STable = styled(SContainer as any)`
  flex-direction: column;
  text-align: left;
`;

const SRow = styled.div`
  width: 100%;
  display: flex;
  margin: 6px 0;
`;

const SKey = styled.div`
  width: 30%;
  font-weight: 700;
`;

const SValue = styled.div`
  width: 70%;
  font-family: monospace;
`;

const STestButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const STestButton = styled(Button as any)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 64px;
  width: 100%;
  max-width: 175px;
  margin: 12px;
`;

interface IResult {
  method: string;
  body: Array<
    Array<{
      txID: string;
      signingAddress?: string;
      signature: string;
    } | null>
  >;
}

interface IAppState {
  connector: WalletConnect | null;
  fetching: boolean;
  connected: boolean;
  showModal: boolean;
  pendingRequest: boolean;
  signedTxns: Uint8Array[][] | null;
  pendingSubmissions: Array<number | Error>;
  uri: string;
  accounts: string[];
  address: string;
  result: IResult | null;
  chain: ChainType;
  assets: IAssetData[];
}

const INITIAL_STATE: IAppState = {
  connector: null,
  fetching: false,
  connected: false,
  showModal: false,
  pendingRequest: false,
  signedTxns: null,
  pendingSubmissions: [],
  uri: "",
  accounts: [],
  address: "",
  result: null,
  chain: ChainType.TestNet,
  assets: [],
};

class App extends React.Component<unknown, IAppState> {
  public state: IAppState = {
    ...INITIAL_STATE,
  };

  public walletConnectInit = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });

    await this.setState({ connector });

    // check if already connected
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    }

    // subscribe to events
    await this.subscribeToEvents();
  };
  public subscribeToEvents = () => {
    const { connector } = this.state;

    if (!connector) {
      return;
    }

    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);

      if (error) {
        throw error;
      }

      const { accounts } = payload.params[0];
      this.onSessionUpdate(accounts);
    });

    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);

      if (error) {
        throw error;
      }

      this.onConnect(payload);
    });

    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);

      if (error) {
        throw error;
      }

      this.onDisconnect();
    });

    if (connector.connected) {
      const { accounts } = connector;
      console.log(accounts);
      const address = accounts[0];
      this.setState({
        connected: true,
        accounts,
        address,
      });
      this.onSessionUpdate(accounts);
    }

    this.setState({ connector });
  };

  public killSession = async () => {
    const { connector } = this.state;
    if (connector) {
      connector.killSession();
    }
    this.resetApp();
  };

  public chainUpdate = (newChain: ChainType) => {
    this.setState({ chain: newChain }, this.getAccountAssets);
  };

  public resetApp = async () => {
    await this.setState({ ...INITIAL_STATE });
  };

  public onConnect = async (payload: IInternalEvent) => {
    const { accounts } = payload.params[0];
    console.log(accounts);
    const address = accounts[0];
    await this.setState({
      connected: true,
      accounts,
      address,
    });
    this.getAccountAssets();
  };

  public onDisconnect = async () => {
    this.resetApp();
  };

  public onSessionUpdate = async (accounts: string[]) => {
    const address = accounts[0];
    await this.setState({ accounts, address });
    await this.getAccountAssets();
  };

  public getAccountAssets = async () => {
    const { address, chain } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(chain, address);

      await this.setState({ fetching: false, address, assets });
    } catch (error) {
      console.error(error);
      await this.setState({ fetching: false });
    }
  };

  public toggleModal = () =>
    this.setState({
      showModal: !this.state.showModal,
      pendingSubmissions: [],
    });

  public signTxnScenario = async (scenario: Scenario) => {
    const { connector, address, chain } = this.state;
    console.log(scenario.name);
    if (!connector) {
      return;
    }

    const account = {
      address: "KMWDMTFGJKYMVVJ65WG3B3RPJAXUM7IFT5FAK5BM66BUPUMWOJCQM27AVY",
      mnemonic:
        "decline catalog moment lottery panther connect stand soap glare second police disagree height number asset combine scan certain room call runway decide question able hello",
    };
    const operations: IOperation[] = [
      {
        operation_id: "1050a11a-65f8-4d33-b1ee-d254a13e6046",
        operation_group: "7450ce65-913b-4782-867b-59039f5c3f14",
        operation_scenario: "TOP_UP_WITH_WALLETCONNECT",
        algo_transaction_id: null,
        algo_transaction:
          "iqNhbXTOAD+hEKNmZWXNA+iiZnbOAYmhhKNnZW6sdGVzdG5ldC12MS4womdoxCBIY7UYpLPITsgQ8i1PEIHLD3HwWaesIN7GL39w5Qk6IqJsds4BiaVsomx4xCAnRTW86SvrSbILZW5OoSxe9SxoU2mCchVwGhrk0Hi34KNyY3bEID1ZKCBgm4uPxpouem8Nczey/xzWuYvvP6b7IQRmsbSZo3NuZMQgRTYAfu96wQp8H8WhDxzhWeN7hkOhSw30rGokUEZYHJKkdHlwZaNwYXk=",
        signed_algo_transaction: null,
        type: "TRANSFER_ALGO_WALLETCONNECT",
        is_walletconnect_operation: true,
      },
      {
        operation_id: "772f5f03-98fc-41a4-9b83-2ced9cbc3583",
        operation_group: "7450ce65-913b-4782-867b-59039f5c3f14",
        operation_scenario: "TOP_UP_WITH_WALLETCONNECT",
        algo_transaction_id: null,
        algo_transaction:
          "i6RhYW10zgAPQkCkYXJjdsQgUyw2TKZKsMrVPu2NsO4vSC9GfQWfSgV0LPeDR9GWckWjZmVlzQPoomZ2zgGJoYSjZ2VurHRlc3RuZXQtdjEuMKJnaMQgSGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiKibHbOAYmlbKJseMQgRDBmYPpOFK/DCbnqCm8O4MaAqk1YIvO5fCgpTTXaD0Sjc25kxCA9WSggYJuLj8aaLnpvDXM3sv8c1rmL7z+m+yEEZrG0maR0eXBlpWF4ZmVypHhhaWTOAOcfCA==",
        signed_algo_transaction: null,
        type: "TRANSFER_IBFX",
        is_walletconnect_operation: false,
      },
    ];

    try {
      const params = await apiGetTxnParams(chain);
      const txns: any[] = [];
      const results: IOperation[] = [];
      operations.forEach(op => {
        const bytes = Uint8Array.from(Buffer.from(op.algo_transaction, "base64"));
        const transaction = algosdk.decodeUnsignedTransaction(bytes);
        transaction.firstRound = params.firstRound;
        transaction.lastRound = params.lastRound;
        op.transaction = transaction;
        txns.push(op.transaction);
      });
      console.log(txns);
      algosdk.assignGroupID(txns);
      operations.forEach(op => {
        op.algo_transaction = Buffer.from(
          algosdk.encodeUnsignedTransaction(op.transaction as algosdk.Transaction),
        ).toString("base64");
        if (op.is_walletconnect_operation === false) {
          const userKey = algosdk.mnemonicToSecretKey(account.mnemonic);
          const signedTxn = algosdk.signTransaction(
            op.transaction as algosdk.Transaction,
            userKey.sk,
          );
          op.signed_txn = signedTxn.blob;
          op.signed_algo_transaction = Buffer.from(signedTxn.blob).toString("base64");
          op.algo_transaction_id = signedTxn.txID;
          results.push(op);
        }
      });
      const txnsToSign = await scenario(chain, address, operations);

      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      const flatTxns = txnsToSign.reduce((acc, val) => acc.concat(val), []);
      console.log("flatTxns", flatTxns);

      const walletTxns: IWalletTransaction[] = flatTxns.map(
        ({ txn, signers, authAddr, message }) => ({
          // operation.algo_transaction
          txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64"),
          signers, // TODO: put auth addr in signers array
          authAddr,
          message,
        }),
      );
      walletTxns.forEach(walletTxn => {
        console.log("walletTxn:", walletTxn.txn);
        // signedOperation.algo_transaction = walletTxn.txn;
      });

      // sign transaction
      const requestParams: SignTxnParams = [walletTxns];
      console.log(requestParams);
      const request = formatJsonRpcRequest("algo_signTxn", requestParams);
      console.log(request);
      const response: Array<string | null> = await connector.sendCustomRequest(request);

      console.log("Raw response:", response);
      const result = response.filter(element => {
        return element !== null;
      });
      console.log("Response:", result);

      const indexToGroup = (index: number) => {
        for (let group = 0; group < txnsToSign.length; group++) {
          const groupLength = txnsToSign[group].length;
          if (index < groupLength) {
            return [group, index];
          }

          index -= groupLength;
        }

        throw new Error(`Index too large for groups: ${index}`);
      };

      const signedPartialTxns: Array<Array<Uint8Array | null>> = txnsToSign.map(() => []);
      result.forEach((r, i) => {
        const [group, groupIndex] = indexToGroup(i);
        const toSign = txnsToSign[group][groupIndex];
        // const op = operations.find(operation => {
        //   return operation.operation_id === toSign.operation_id;
        // });

        if (r == null) {
          if (toSign.signers !== undefined && toSign.signers?.length < 1) {
            signedPartialTxns[group].push(null);
            return;
          }
          throw new Error(`Transaction at index ${i}: was not signed when it should have been`);
        }

        if (toSign.signers !== undefined && toSign.signers?.length < 1) {
          throw new Error(`Transaction at index ${i} was signed when it should not have been`);
        }
        const rawSignedTxn = Buffer.from(r, "base64");
        console.log("rawSignedTxn", rawSignedTxn);
        // if (op) {
        //   const a = {
        //     ...op,
        //     signedTxn: algosdk.decodeSignedTransaction(rawSignedTxn),
        //   };
        //   console.log(a);
        //   operations2.push(a);
        // }
        signedPartialTxns[group].push(new Uint8Array(rawSignedTxn));
        console.log(signedPartialTxns);
      });

      const signedTxns: Uint8Array[][] = signedPartialTxns.map(
        (signedPartialTxnsInternal, group) => {
          return signedPartialTxnsInternal.map((stxn, groupIndex) => {
            if (stxn) {
              return stxn;
            }

            return signTxnWithTestAccount(txnsToSign[group][groupIndex].txn);
          });
        },
      );

      if (scenario.name === "testTxn") {
        results.forEach(op => {
          signedTxns.push(op.signed_txn);
        });
      }

      const signedTxnInfo: Array<Array<{
        txID: string;
        signingAddress?: string;
        signature: string;
      } | null>> = signedPartialTxns.map((signedPartialTxnsInternal, group) => {
        return signedPartialTxnsInternal.map((rawSignedTxn, i) => {
          if (rawSignedTxn == null) {
            return null;
          }
          const op = operations.find(operation => {
            return operation.operation_id === txnsToSign[group][i].operation_id;
          });
          const signedEncoded = Buffer.from(rawSignedTxn).toString("base64");
          const signedTxn = algosdk.decodeSignedTransaction(rawSignedTxn);
          // signedOperation.algo_transaction_id = i
          console.log("signed encoded: ", signedEncoded);
          // signedOperation.signed_algo_transaction = Buffer.from(rawSignedTxn).toString("base64")
          console.log("signed tx:", signedTxn);
          const txn = (signedTxn.txn as unknown) as algosdk.Transaction;
          const txID = txn.txID();
          console.log("txId:", txID);
          const unsignedTxID = txnsToSign[group][i].txn.txID();

          if (txID !== unsignedTxID) {
            throw new Error(
              `Signed transaction at index ${i} differs from unsigned transaction. Got ${txID}, expected ${unsignedTxID}`,
            );
          }

          if (!signedTxn.sig) {
            throw new Error(`Signature not present on transaction at index ${i}`);
          }

          if (op) {
            op.algo_transaction_id = txID;
            op.signed_algo_transaction = signedEncoded;
            console.log("op:", op);
            results.push(op);
          }

          return {
            txID,
            signingAddress: signedTxn.sgnr ? algosdk.encodeAddress(signedTxn.sgnr) : undefined,
            signature: Buffer.from(signedTxn.sig).toString("base64"),
          };
        });
      });

      // operations.forEach(op => {
      //   if (op.is_walletconnect_operation) {
      //     const bytes = Uint8Array.from(Buffer.from(op.algo_transaction, "base64"));
      //     const transaction = algosdk.decodeUnsignedTransaction(bytes);
      //   }
      // });
      results.forEach(op => {
        delete op.transaction;
        delete op.signed_txn;
      });

      console.log("Signed txn info:", signedTxnInfo);
      console.log("formatted operations", JSON.stringify(results));

      // format displayed result
      const formattedResult: IResult = {
        method: "algo_signTxn",
        body: signedTxnInfo,
      };

      // display result
      this.setState({
        connector,
        pendingRequest: false,
        signedTxns,
        result: formattedResult,
      });
    } catch (error) {
      console.error(error);
      this.setState({ connector, pendingRequest: false, result: null });
    }
  };

  public async submitSignedTransaction() {
    const { signedTxns, chain } = this.state;
    if (signedTxns == null) {
      throw new Error("Transactions to submit are null");
    }

    this.setState({ pendingSubmissions: signedTxns.map(() => 0) });

    signedTxns.forEach(async (signedTxn, index) => {
      try {
        const confirmedRound = await apiSubmitTransactions(chain, signedTxn);

        this.setState(prevState => {
          return {
            pendingSubmissions: prevState.pendingSubmissions.map((v, i) => {
              if (index === i) {
                return confirmedRound;
              }
              return v;
            }),
          };
        });

        console.log(`Transaction confirmed at round ${confirmedRound}`);
      } catch (err) {
        this.setState(prevState => {
          return {
            pendingSubmissions: prevState.pendingSubmissions.map((v, i) => {
              if (index === i) {
                return err;
              }
              return v;
            }),
          };
        });

        console.error(`Error submitting transaction at index ${index}:`, err);
      }
    });
  }

  public render = () => {
    const {
      chain,
      assets,
      address,
      connected,
      fetching,
      showModal,
      pendingRequest,
      pendingSubmissions,
      result,
    } = this.state;
    return (
      <SLayout>
        <Column maxWidth={1000} spanHeight>
          <Header
            connected={connected}
            address={address}
            killSession={this.killSession}
            chain={chain}
            chainUpdate={this.chainUpdate}
          />
          <SContent>
            {!address && !assets.length ? (
              <SLanding center>
                <h3>{`Algorand WalletConnect v${process.env.REACT_APP_VERSION} Demo`}</h3>
                <SButtonContainer>
                  <SConnectButton left onClick={this.walletConnectInit} fetching={fetching}>
                    {"Connect to WalletConnect"}
                  </SConnectButton>
                </SButtonContainer>
              </SLanding>
            ) : (
              <SBalances>
                <h3>Balances</h3>
                {!fetching ? (
                  <AccountAssets assets={assets} />
                ) : (
                  <Column center>
                    <SContainer>
                      <Loader />
                    </SContainer>
                  </Column>
                )}
                <h3>Actions</h3>
                <Column center>
                  <STestButtonContainer>
                    {scenarios.map(({ name, scenario }) => (
                      <STestButton left key={name} onClick={() => this.signTxnScenario(scenario)}>
                        {name}
                      </STestButton>
                    ))}
                  </STestButtonContainer>
                </Column>
              </SBalances>
            )}
          </SContent>
        </Column>
        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <SModalContainer>
              <SModalTitle>{"Pending Call Request"}</SModalTitle>
              <SContainer>
                <Loader />
                <SModalParagraph>{"Approve or reject request using your wallet"}</SModalParagraph>
              </SContainer>
            </SModalContainer>
          ) : result ? (
            <SModalContainer>
              <SModalTitle>{"Call Request Approved"}</SModalTitle>
              <STable>
                <SRow>
                  <SKey>Method</SKey>
                  <SValue>{result.method}</SValue>
                </SRow>
                {result.body.map((signedTxns, index) => (
                  <SRow key={index}>
                    <SKey>{`Atomic group ${index}`}</SKey>
                    <SValue>
                      {signedTxns.map((txn, txnIndex) => (
                        <div key={txnIndex}>
                          {!!txn?.txID && <p>TxID: {txn.txID}</p>}
                          {!!txn?.signature && <p>Sig: {txn.signature}</p>}
                          {!!txn?.signingAddress && <p>AuthAddr: {txn.signingAddress}</p>}
                        </div>
                      ))}
                    </SValue>
                  </SRow>
                ))}
              </STable>
              <SModalButton
                onClick={() => this.submitSignedTransaction()}
                disabled={pendingSubmissions.length !== 0}
                style={{
                  color: "red",
                  backgroundColor: "lightblue",
                  border: "5px",
                  padding: "10px",
                }}
              >
                {"Submit transaction to network."}
              </SModalButton>
              {pendingSubmissions.map((submissionInfo, index) => {
                const key = `${index}:${
                  typeof submissionInfo === "number" ? submissionInfo : "err"
                }`;
                const prefix = `Txn Group ${index}: `;
                let content: string;

                if (submissionInfo === 0) {
                  content = "Submitting...";
                } else if (typeof submissionInfo === "number") {
                  content = `Confirmed at round ${submissionInfo}`;
                } else {
                  content = "Rejected by network. See console for more information.";
                }

                return <SModalTitle key={key}>{prefix + content}</SModalTitle>;
              })}
            </SModalContainer>
          ) : (
            <SModalContainer>
              <SModalTitle>{"Call Request Rejected"}</SModalTitle>
            </SModalContainer>
          )}
        </Modal>
      </SLayout>
    );
  };
}

export default App;
