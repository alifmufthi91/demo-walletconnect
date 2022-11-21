/* eslint-disable quotes */
import algosdk from "algosdk";
import { apiGetTxnParams, ChainType } from "./helpers/api";

const testAccounts = [
  algosdk.mnemonicToSecretKey(
    "cannon scatter chest item way pulp seminar diesel width tooth enforce fire rug mushroom tube sustain glide apple radar chronic ask plastic brown ability badge",
  ),
  algosdk.mnemonicToSecretKey(
    "person congress dragon morning road sweet horror famous bomb engine eager silent home slam civil type melt field dry daring wheel monitor custom above term",
  ),
  algosdk.mnemonicToSecretKey(
    "faint protect home drink journey humble tube clinic game rough conduct sell violin discover limit lottery anger baby leaf mountain peasant rude scene abstract casual",
  ),
];

export function signTxnWithTestAccount(txn: algosdk.Transaction): Uint8Array {
  const sender = algosdk.encodeAddress(txn.from.publicKey);

  for (const testAccount of testAccounts) {
    if (testAccount.addr === sender) {
      return txn.signTxn(testAccount.sk);
    }
  }

  throw new Error(`Cannot sign transaction from unknown test account: ${sender}`);
}

export interface IScenarioTxn {
  txn: algosdk.Transaction;
  signers?: string[];
  authAddr?: string;
  message?: string;
}

export type ScenarioReturnType = IScenarioTxn[][];

export type Scenario = (chain: ChainType, address: string) => Promise<ScenarioReturnType>;

function getAssetIndex(chain: ChainType): number {
  if (chain === ChainType.MainNet) {
    // MainNet USDC
    return 31566704;
  }

  if (chain === ChainType.TestNet) {
    // TestNet USDC
    return 10458941;
  }

  throw new Error(`Asset not defined for chain ${chain}`);
}

function getAssetReserve(chain: ChainType): string {
  if (chain === ChainType.MainNet) {
    return "2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM";
  }

  if (chain === ChainType.TestNet) {
    return "UJBZPEMXLD6KZOLUBUDSZ3DXECXYDADZZLBH6O7CMYXHE2PLTCW44VK5T4";
  }

  throw new Error(`Asset reserve not defined for chain ${chain}`);
}

function getAppIndex(chain: ChainType): number {
  if (chain === ChainType.MainNet) {
    return 305162725;
  }

  if (chain === ChainType.TestNet) {
    return 22314999;
  }

  throw new Error(`App not defined for chain ${chain}`);
}

const singlePayTxn: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: address,
    to: address,
    amount: 100000,
    note: new Uint8Array(Buffer.from("example note value")),
    suggestedParams,
  });

  const txnsToSign = [
    {
      txn,
      message: "This is a payment transaction that sends 0.1 Algos to yourself.",
    },
  ];
  return [txnsToSign];
};

const singleAssetOptInTxn: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);
  const assetIndex = getAssetIndex(chain);

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: address,
    to: address,
    amount: 0,
    assetIndex,
    note: new Uint8Array(Buffer.from("example note value")),
    suggestedParams,
  });

  const txnsToSign = [
    {
      txn,
      message: "This transaction opts you into the USDC asset if you have not already opted in.",
    },
    {
      txn,
      message: "This transaction opts you into the USDC asset if you have not already opted in.",
    },
  ];
  return [txnsToSign];
};

const singleAssetTransferTxn: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);
  const assetIndex = getAssetIndex(chain);

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: address,
    to: address,
    amount: 1000000,
    assetIndex,
    note: new Uint8Array(Buffer.from("example note value")),
    suggestedParams,
  });

  const txnsToSign = [{ txn, message: "This transaction will send 1 USDC to yourself." }];
  return [txnsToSign];
};

const singleAssetCloseTxn: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);
  const assetIndex = getAssetIndex(chain);

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: address,
    to: getAssetReserve(chain),
    amount: 0,
    assetIndex,
    note: new Uint8Array(Buffer.from("example note value")),
    closeRemainderTo: testAccounts[1].addr,
    suggestedParams,
  });

  const txnsToSign = [
    {
      txn,
      message:
        "This transaction will opt you out of the USDC asset. DO NOT submit this to MainNet if you have more than 0 USDC.",
    },
  ];
  return [txnsToSign];
};

const singleAppOptIn: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);

  const appIndex = getAppIndex(chain);

  const txn = algosdk.makeApplicationOptInTxnFromObject({
    from: address,
    appIndex,
    note: new Uint8Array(Buffer.from("example note value")),
    appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
    suggestedParams,
  });

  const txnsToSign = [{ txn, message: "This transaction will opt you into a test app." }];
  return [txnsToSign];
};

const singleAppCall: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);

  const appIndex = getAppIndex(chain);

  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    from: address,
    appIndex,
    note: new Uint8Array(Buffer.from("example note value")),
    appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
    suggestedParams,
  });

  const txnsToSign = [{ txn, message: "This transaction will invoke an app call on a test app." }];
  return [txnsToSign];
};

const singleAppCloseOut: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);

  const appIndex = getAppIndex(chain);

  const txn = algosdk.makeApplicationCloseOutTxnFromObject({
    from: address,
    appIndex,
    note: new Uint8Array(Buffer.from("example note value")),
    appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
    suggestedParams,
  });

  const txnsToSign = [{ txn, message: "This transaction will opt you out of the test app." }];
  return [txnsToSign];
};

const singleAppClearState: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);

  const appIndex = getAppIndex(chain);

  const txn = algosdk.makeApplicationClearStateTxnFromObject({
    from: address,
    appIndex,
    note: new Uint8Array(Buffer.from("example note value")),
    appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
    suggestedParams,
  });

  const txnsToSign = [
    { txn, message: "This transaction will forcibly opt you out of the test app." },
  ];
  return [txnsToSign];
};

const testTxn: Scenario = async (chain: ChainType): Promise<ScenarioReturnType> => {
  const operations = [
    {
      operation_id: "354b0800-6960-11ed-bd09-9b173a48f256",
      created_at: 1668152011453,
      platform_key_id: null,
      nft_id: "2bb25dc0-6960-11ed-bd09-9b173a48f256",
      sell_escrow_id: null,
      auction_id: null,
      transaction_id: null,
      loan_id: null,
      operation_group: "35350f00-6960-11ed-a7c1-4f049b1e1397",
      operation_scenario: "CREATE_ASA",
      algo_transaction:
        "iaNhbXTOAAGSWKNmZWXNA+iiZnbOAYgk3KNnZW6sdGVzdG5ldC12MS4womdoxCBIY7UYpLPITsgQ8i1PEIHLD3HwWaesIN7GL39w5Qk6IqJsds4BiCjEo3JjdsQgUyw2TKZKsMrVPu2NsO4vSC9GfQWfSgV0LPeDR9GWckWjc25kxCA9WSggYJuLj8aaLnpvDXM3sv8c1rmL7z+m+yEEZrG0maR0eXBlo3BheQ==",
      json_algo_transaction:
        '{"name":"Transaction","tag":"TX","from":"HVMSQIDATOFY7RU2FZ5G6DLTG6ZP6HGWXGF66P5G7MQQIZVRWSM5TAWHV4","to":"KMWDMTFGJKYMVVJ65WG3B3RPJAXUM7IFT5FAK5BM66BUPUMWOJCQM27AVY","amount":103000,"note":{},"type":"pay","flatFee":false,"genesisHash":"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=","fee":1000,"firstRound":25699548,"lastRound":25700548,"genesisID":"testnet-v1.0","appArgs":[],"lease":{}}',
      type: "TRANSFER_ALGO",
      status: "INIT",
      priority: -3,
      is_admin_op: true,
      is_platform_op: false,
    },
    {
      operation_id: "354c6790-6960-11ed-bd09-9b173a48f256",
      created_at: 1668152011453,
      platform_key_id: null,
      nft_id: "2bb25dc0-6960-11ed-bd09-9b173a48f256",
      sell_escrow_id: null,
      auction_id: null,
      transaction_id: null,
      loan_id: null,
      operation_group: "35350f00-6960-11ed-a7c1-4f049b1e1397",
      operation_scenario: "CREATE_ASA",
      algo_transaction:
        "iqRhYW10zgADDUCkYXJjdsQgPVkoIGCbi4/Gmi56bw1zN7L/HNa5i+8/pvshBGaxtJmjZmVlzQPoomZ2zgGIJNyjZ2VurHRlc3RuZXQtdjEuMKJnaMQgSGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiKibHbOAYgoxKNzbmTEIFMsNkymSrDK1T7tjbDuL0gvRn0Fn0oFdCz3g0fRlnJFpHR5cGWlYXhmZXKkeGFpZM4A5x8I",
      json_algo_transaction:
        '{"name":"Transaction","tag":"TX","type":"axfer","from":"KMWDMTFGJKYMVVJ65WG3B3RPJAXUM7IFT5FAK5BM66BUPUMWOJCQM27AVY","to":"HVMSQIDATOFY7RU2FZ5G6DLTG6ZP6HGWXGF66P5G7MQQIZVRWSM5TAWHV4","amount":200000,"assetIndex":15146760,"note":{},"flatFee":false,"genesisHash":"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=","fee":1000,"firstRound":25699548,"lastRound":25700548,"genesisID":"testnet-v1.0","appArgs":[],"lease":{}}',
      type: "PAY_FEE_IBFX1",
      status: "INIT",
      priority: 1,
      is_admin_op: false,
      is_platform_op: false,
      is_escrow_op: false,
    },
    {
      operation_id: "354d7900-6960-11ed-bd09-9b173a48f256",
      created_at: 1668152011453,
      platform_key_id: null,
      nft_id: "2bb25dc0-6960-11ed-bd09-9b173a48f256",
      sell_escrow_id: null,
      auction_id: null,
      transaction_id: null,
      loan_id: null,
      operation_group: "35350f00-6960-11ed-a7c1-4f049b1e1397",
      operation_scenario: "CREATE_ASA",
      algo_transaction:
        "iKRhcGFyg6JhbqZSQUJCQViiYXXZNWlwZnM6Ly9RbVd4NVBkajhxNE1WZ0NMMnVYRzRuVFZvVndGYjFWYWNvOEFxUllOZ3dVWVBMoXQFo2ZlZc0D6KJmds4BiCTco2dlbqx0ZXN0bmV0LXYxLjCiZ2jEIEhjtRiks8hOyBDyLU8QgcsPcfBZp6wg3sYvf3DlCToiomx2zgGIKMSjc25kxCBTLDZMpkqwytU+7Y2w7i9IL0Z9BZ9KBXQs94NH0ZZyRaR0eXBlpGFjZmc=",
      json_algo_transaction:
        '{"name":"Transaction","tag":"TX","from":"KMWDMTFGJKYMVVJ65WG3B3RPJAXUM7IFT5FAK5BM66BUPUMWOJCQM27AVY","note":{},"assetTotal":5,"assetDecimals":0,"assetDefaultFrozen":false,"assetName":"RABBAX","assetURL":"ipfs://QmWx5Pdj8q4MVgCL2uXG4nTVoVwFb1Vaco8AqRYNgwUYPL","type":"acfg","flatFee":false,"genesisHash":"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=","fee":1000,"firstRound":25699548,"lastRound":25700548,"genesisID":"testnet-v1.0","appArgs":[],"lease":{}}',
      type: "CREATE_ASSET",
      status: "INIT",
      signer_type: "WALLET_CONNECT",
      priority: 4,
      is_admin_op: false,
      is_platform_op: false,
      is_escrow_op: false,
    },
  ];
  const suggestedParams = await apiGetTxnParams(chain);
  const txns = [];
  for (const operation of operations) {
    const bytes = Uint8Array.from(Buffer.from(operation.algo_transaction, "base64"));
    const transaction = algosdk.decodeUnsignedTransaction(bytes);
    transaction.firstRound = suggestedParams.firstRound;
    transaction.lastRound = suggestedParams.lastRound;
    txns.push({ txn: transaction, message: "test" });
  }
  return [txns];
};

export const scenarios: Array<{ name: string; scenario: Scenario }> = [
  {
    name: "1. Sign pay txn",
    scenario: singlePayTxn,
  },
  {
    name: "2. Sign asset opt-in txn",
    scenario: singleAssetOptInTxn,
  },
  {
    name: "3. Sign asset transfer txn",
    scenario: singleAssetTransferTxn,
  },
  {
    name: "4. Sign asset close out txn",
    scenario: singleAssetCloseTxn,
  },
  {
    name: "5. Sign app opt-in txn",
    scenario: singleAppOptIn,
  },
  {
    name: "6. Sign app call txn",
    scenario: singleAppCall,
  },
  {
    name: "7. Sign app close out txn",
    scenario: singleAppCloseOut,
  },
  {
    name: "8. Sign app clear state txn",
    scenario: singleAppClearState,
  },
  {
    name: "test credence txn",
    scenario: testTxn,
  },
];
