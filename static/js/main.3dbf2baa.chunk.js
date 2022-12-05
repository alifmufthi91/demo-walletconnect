(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,n){"use strict";n.d(t,"a",function(){return i}),n.d(t,"b",function(){return d}),n.d(t,"c",function(){return u}),n.d(t,"d",function(){return p});var i,o=n(8),a=n(11),s=n.n(a);!function(e){e.MainNet="mainnet",e.TestNet="testnet"}(i||(i={}));const r=new s.a.Algodv2("","https://mainnet-api.algonode.cloud",""),c=new s.a.Algodv2("","https://testnet-api.algonode.cloud","");function l(e){switch(e){case i.MainNet:return r;case i.TestNet:return c;default:throw new Error(`Unknown chain type: ${e}`)}}function d(e,t){return Object(o.__awaiter)(this,void 0,void 0,function*(){const n=l(e),i=yield n.accountInformation(t).setIntDecoding(s.a.IntDecoding.BIGINT).do(),a=i.amount,r=i.assets.map(({"asset-id":e,amount:t,creator:n,frozen:i})=>({id:Number(e),amount:t,creator:n,frozen:i,decimals:0}));return r.sort((e,t)=>e.id-t.id),yield Promise.all(r.map(e=>Object(o.__awaiter)(this,void 0,void 0,function*(){const{params:t}=yield n.getAssetByID(e.id).do();e.name=t.name,e.unitName=t["unit-name"],e.url=t.url,e.decimals=t.decimals}))),r.unshift({id:0,amount:a,creator:"",frozen:!1,decimals:6,name:"Algo",unitName:"Algo"}),r})}function u(e){return Object(o.__awaiter)(this,void 0,void 0,function*(){return yield l(e).getTransactionParams().do()})}function p(e,t){return Object(o.__awaiter)(this,void 0,void 0,function*(){const{txId:n}=yield l(e).sendRawTransaction(t).do();return yield function(e,t){return Object(o.__awaiter)(this,void 0,void 0,function*(){const n=l(e);let i=yield n.status().do(),o=i["last-round"];for(;;){const e=yield n.pendingTransactionInformation(t).do();if(e["pool-error"])throw new Error(`Transaction Pool Error: ${e["pool-error"]}`);if(e["confirmed-round"])return e["confirmed-round"];i=yield n.statusAfterBlock(o+1).do(),o=i["last-round"]}})}(e,n)})}},169:function(e,t,n){"use strict";(function(e){var i=n(8),o=n(170),a=n(185),s=n(178),r=n.n(s),c=n(11),l=n.n(c),d=n(0),u=n(3),p=n(186),g=n(89),m=n(28),h=n(187),b=n(55),f=n(183),x=n(184),y=n(10),w=n(90),v=n(9);const E=u.b.div`
  position: relative;
  width: 100%;
  /* height: 100%; */
  min-height: 100vh;
  text-align: center;
`,_=Object(u.b)(x.a)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`,T=Object(u.b)(m.a)`
  height: 600px;
`,$=Object(u.b)(m.a)`
  width: 250px;
  margin: 50px 0;
`,A=Object(u.b)(g.a)`
  border-radius: 8px;
  font-size: ${v.b.size.medium};
  height: 44px;
  width: 100%;
  margin: 12px 0;
`,O=u.b.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`,S=u.b.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`,j=u.b.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`,k=u.b.button`
  margin: 1em 0;
  font-size: 18px;
  font-weight: 700;
`,I=u.b.p`
  margin-top: 30px;
`,z=Object(u.b)(T)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`,C=Object(u.b)(O)`
  flex-direction: column;
  text-align: left;
`,N=u.b.div`
  width: 100%;
  display: flex;
  margin: 6px 0;
`,U=u.b.div`
  width: 30%;
  font-weight: 700;
`,R=u.b.div`
  width: 70%;
  font-family: monospace;
`,P=u.b.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`,M=Object(u.b)(g.a)`
  border-radius: 8px;
  font-size: ${v.b.size.medium};
  height: 64px;
  width: 100%;
  max-width: 175px;
  margin: 12px;
`,W={connector:null,fetching:!1,connected:!1,showModal:!1,pendingRequest:!1,signedTxns:null,pendingSubmissions:[],uri:"",accounts:[],address:"",result:null,chain:y.a.TestNet,assets:[]};t.a=class extends d.Component{constructor(){super(...arguments),this.state=Object.assign({},W),this.walletConnectInit=(()=>Object(i.__awaiter)(this,void 0,void 0,function*(){const e=new a.a({bridge:"https://bridge.walletconnect.org",qrcodeModal:r.a});yield this.setState({connector:e}),e.connected||(yield e.createSession()),yield this.subscribeToEvents()})),this.subscribeToEvents=(()=>{const{connector:e}=this.state;if(e){if(e.on("session_update",(e,t)=>Object(i.__awaiter)(this,void 0,void 0,function*(){if(console.log('connector.on("session_update")'),e)throw e;const{accounts:n}=t.params[0];this.onSessionUpdate(n)})),e.on("connect",(e,t)=>{if(console.log('connector.on("connect")'),e)throw e;this.onConnect(t)}),e.on("disconnect",(e,t)=>{if(console.log('connector.on("disconnect")'),e)throw e;this.onDisconnect()}),e.connected){const{accounts:t}=e;console.log(t);const n=t[0];this.setState({connected:!0,accounts:t,address:n}),this.onSessionUpdate(t)}this.setState({connector:e})}}),this.killSession=(()=>Object(i.__awaiter)(this,void 0,void 0,function*(){const{connector:e}=this.state;e&&e.killSession(),this.resetApp()})),this.chainUpdate=(e=>{this.setState({chain:e},this.getAccountAssets)}),this.resetApp=(()=>Object(i.__awaiter)(this,void 0,void 0,function*(){yield this.setState(Object.assign({},W))})),this.onConnect=(e=>Object(i.__awaiter)(this,void 0,void 0,function*(){const{accounts:t}=e.params[0];console.log(t);const n=t[0];yield this.setState({connected:!0,accounts:t,address:n}),this.getAccountAssets()})),this.onDisconnect=(()=>Object(i.__awaiter)(this,void 0,void 0,function*(){this.resetApp()})),this.onSessionUpdate=(e=>Object(i.__awaiter)(this,void 0,void 0,function*(){const t=e[0];yield this.setState({accounts:e,address:t}),yield this.getAccountAssets()})),this.getAccountAssets=(()=>Object(i.__awaiter)(this,void 0,void 0,function*(){const{address:e,chain:t}=this.state;this.setState({fetching:!0});try{const i=yield Object(y.b)(t,e);yield this.setState({fetching:!1,address:e,assets:i})}catch(n){console.error(n),yield this.setState({fetching:!1})}})),this.signByWalletconnect=((t,n,a)=>Object(i.__awaiter)(this,void 0,void 0,function*(){const i=[],{address:s,chain:r}=this.state,c=yield n(r,s,a);this.toggleModal(),this.setState({pendingRequest:!0});const d=c.reduce((e,t)=>e.concat(t),[]);console.log("flatTxns",d);const u=[d.map(({txn:t,signers:n,authAddr:i,message:o})=>({txn:e.from(l.a.encodeUnsignedTransaction(t)).toString("base64"),signers:n,authAddr:i,message:o}))];console.log(u);const p=Object(o.formatJsonRpcRequest)("algo_signTxn",u);console.log(p);const g=yield t.sendCustomRequest(p);console.log("Raw response:",g);const m=g.filter(e=>null!==e);console.log("Response:",m);const h=c.map(()=>[]);m.forEach((t,n)=>{var i,o;const[a,s]=(e=>{for(let t=0;t<c.length;t++){const n=c[t].length;if(e<n)return[t,e];e-=n}throw new Error(`Index too large for groups: ${e}`)})(n),r=c[a][s];if(null==t){if(void 0!==r.signers&&(null===(i=r.signers)||void 0===i?void 0:i.length)<1)return void h[a].push(null);throw new Error(`Transaction at index ${n}: was not signed when it should have been`)}if(void 0!==r.signers&&(null===(o=r.signers)||void 0===o?void 0:o.length)<1)throw new Error(`Transaction at index ${n} was signed when it should not have been`);const l=e.from(t,"base64");console.log("rawSignedTxn",l),h[a].push(new Uint8Array(l)),console.log(h)});const b=h.map((e,t)=>e.map((e,n)=>e||Object(w.b)(c[t][n].txn)));"testTxn"===n.name&&i.forEach(e=>{b.push(e.signed_txn)});const f=h.map((t,n)=>t.map((t,o)=>{if(null==t)return null;const s=a.find(e=>e.operation_id===c[n][o].operation_id),r=e.from(t).toString("base64"),d=l.a.decodeSignedTransaction(t);console.log("signed encoded: ",r),console.log("signed tx:",d);const u=d.txn.txID();console.log("txId:",u);const p=c[n][o].txn.txID();if(u!==p)throw new Error(`Signed transaction at index ${o} differs from unsigned transaction. Got ${u}, expected ${p}`);if(!d.sig)throw new Error(`Signature not present on transaction at index ${o}`);return s&&(s.algo_transaction_id=u,s.signed_algo_transaction=r,console.log("op:",s),i.push(s)),{txID:u,signingAddress:d.sgnr?l.a.encodeAddress(d.sgnr):void 0,signature:e.from(d.sig).toString("base64")}}));return{results:i,signedTxnInfo:f,signedTxns:b}})),this.toggleModal=(()=>this.setState({showModal:!this.state.showModal,pendingSubmissions:[]})),this.signTxnScenario=(t=>Object(i.__awaiter)(this,void 0,void 0,function*(){const{connector:n,chain:i}=this.state;if(console.log(t.name),!n)return;const o="decline catalog moment lottery panther connect stand soap glare second police disagree height number asset combine scan certain room call runway decide question able hello",a=[{operation_id:"fc42f76b-8ac4-4494-83fb-ad12187a37c5",user:null,transaction:{transaction_id:"ec2799ba-17c8-4133-bf5e-4c2eec27c53a",asset:{assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",assetName:"IBFX_TYPE_I",description:null,icon:null,decimals:1e5,appId:null,asaId:15146760,abilities:[{id:"39ffab68-3540-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"TRANSFER",createdAt:1635131050,updatedAt:null},{id:"fa76db8b-3c60-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"PAY",createdAt:1635914775,updatedAt:null},{id:"39dbc0b8-3540-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"TOPUP",createdAt:1635131050,updatedAt:null},{id:"39b75b26-3540-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"CONVERT",createdAt:1635131050,updatedAt:null}],createdAt:1634889627,updatedAt:null},sender:null,receiver:{user_id:"790b88e0-e88b-11ec-8cbe-cf88621f4049",algo_address:"KMWDMTFGJKYMVVJ65WG3B3RPJAXUM7IFT5FAK5BM66BUPUMWOJCQM27AVY",type:"USER",status:"ACTIVE",created_at:1654844786608,updated_at:1654844795659},order_id:null,transaction_code:"A545JEXCH8REP68",invoice:null,amount:1e5,type:"TOP_UP_WITH_WALLETCONNECT",status:"INIT",expired_at:1670216607800,created_at:1670215707800,updated_at:null},operation_group:"8bf9d10e-b4f3-4d54-8114-e8755877a9a3",operation_scenario:"TOP_UP_WITH_WALLETCONNECT",algo_transaction_id:null,algo_transaction:"iqNhbXTOAAYagKNmZWXNA+iiZnbOAY03taNnZW6sdGVzdG5ldC12MS4womdoxCBIY7UYpLPITsgQ8i1PEIHLD3HwWaesIN7GL39w5Qk6IqJsds4BjTudomx4xCDkTZVojHIejyM2cFbqcrgIWw3Fmp1D/79jDeUuaFWkB6NyY3bEID1ZKCBgm4uPxpouem8Nczey/xzWuYvvP6b7IQRmsbSZo3NuZMQgRTYAfu96wQp8H8WhDxzhWeN7hkOhSw30rGokUEZYHJKkdHlwZaNwYXk=",signed_algo_transaction:null,type:"TRANSFER_ALGO_WALLETCONNECT",status:"INIT",is_walletconnect_operation:!0,created_at:1670215708082,updated_at:null},{operation_id:"7990a7d7-08bf-4bb4-ab08-9253c401da9a",user:null,transaction:{transaction_id:"ec2799ba-17c8-4133-bf5e-4c2eec27c53a",asset:{assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",assetName:"IBFX_TYPE_I",description:null,icon:null,decimals:1e5,appId:null,asaId:15146760,abilities:[{id:"39ffab68-3540-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"TRANSFER",createdAt:1635131050,updatedAt:null},{id:"fa76db8b-3c60-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"PAY",createdAt:1635914775,updatedAt:null},{id:"39dbc0b8-3540-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"TOPUP",createdAt:1635131050,updatedAt:null},{id:"39b75b26-3540-11ec-b6d3-0242ac120002",assetId:"1e7768ca-330e-11ec-b6d3-0242ac120002",abilityType:"CONVERT",createdAt:1635131050,updatedAt:null}],createdAt:1634889627,updatedAt:null},sender:null,receiver:{user_id:"790b88e0-e88b-11ec-8cbe-cf88621f4049",algo_address:"KMWDMTFGJKYMVVJ65WG3B3RPJAXUM7IFT5FAK5BM66BUPUMWOJCQM27AVY",type:"USER",status:"ACTIVE",created_at:1654844786608,updated_at:1654844795659},order_id:null,transaction_code:"A545JEXCH8REP68",invoice:null,amount:1e5,type:"TOP_UP_WITH_WALLETCONNECT",status:"INIT",expired_at:1670216607800,created_at:1670215707800,updated_at:null},operation_group:"8bf9d10e-b4f3-4d54-8114-e8755877a9a3",operation_scenario:"TOP_UP_WITH_WALLETCONNECT",algo_transaction_id:null,algo_transaction:"i6RhYW10zgABhqCkYXJjdsQgUyw2TKZKsMrVPu2NsO4vSC9GfQWfSgV0LPeDR9GWckWjZmVlzQPoomZ2zgGNN7WjZ2VurHRlc3RuZXQtdjEuMKJnaMQgSGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiKibHbOAY07naJseMQgzBeBNZU19oDIodOC10BbnKMIGB/2dV5LJORKlbSZKdOjc25kxCA9WSggYJuLj8aaLnpvDXM3sv8c1rmL7z+m+yEEZrG0maR0eXBlpWF4ZmVypHhhaWTOAOcfCA==",signed_algo_transaction:null,type:"TRANSFER_IBFX",status:"INIT",is_walletconnect_operation:!1,created_at:1670215708115,updated_at:null}];try{const r=yield Object(y.c)(i),c=[],d=[];a.forEach(t=>{const n=Uint8Array.from(e.from(t.algo_transaction,"base64")),i=l.a.decodeUnsignedTransaction(n);i.firstRound=r.firstRound,i.lastRound=r.lastRound,t.txn=i,c.push(t.txn)}),console.log(c),l.a.assignGroupID(c),a.forEach(t=>{if(t.algo_transaction=e.from(l.a.encodeUnsignedTransaction(t.txn)).toString("base64"),!1===t.is_walletconnect_operation){const n=l.a.mnemonicToSecretKey(o),i=l.a.signTransaction(t.txn,n.sk);t.signed_txn=i.blob,t.signed_algo_transaction=e.from(i.blob).toString("base64"),t.algo_transaction_id=i.txID,d.push(t)}});const{results:u,signedTxnInfo:p,signedTxns:g}=yield this.signByWalletconnect(n,t,a);d.push(...u),d.forEach(e=>{delete e.txn,delete e.signed_txn}),console.log("Signed txn info:",p),console.log("formatted operations",JSON.stringify(d));const m={method:"algo_signTxn",body:p};this.setState({connector:n,pendingRequest:!1,signedTxns:g,result:m})}catch(s){console.error(s),this.setState({connector:n,pendingRequest:!1,result:null})}})),this.render=(()=>{const{chain:e,assets:t,address:n,connected:i,fetching:o,showModal:a,pendingRequest:s,pendingSubmissions:r,result:c}=this.state;return d.createElement(E,null,d.createElement(m.a,{maxWidth:1e3,spanHeight:!0},d.createElement(h.a,{connected:i,address:n,killSession:this.killSession,chain:e,chainUpdate:this.chainUpdate}),d.createElement(_,null,n||t.length?d.createElement(z,null,d.createElement("h3",null,"Balances"),o?d.createElement(m.a,{center:!0},d.createElement(O,null,d.createElement(b.a,null))):d.createElement(p.a,{assets:t}),d.createElement("h3",null,"Actions"),d.createElement(m.a,{center:!0},d.createElement(P,null,w.a.map(({name:e,scenario:t})=>d.createElement(M,{left:!0,key:e,onClick:()=>this.signTxnScenario(t)},e))))):d.createElement(T,{center:!0},d.createElement("h3",null,"Algorand WalletConnect v1.8.0 Demo"),d.createElement($,null,d.createElement(A,{left:!0,onClick:this.walletConnectInit,fetching:o},"Connect to WalletConnect"))))),d.createElement(f.a,{show:a,toggleModal:this.toggleModal},s?d.createElement(S,null,d.createElement(j,null,"Pending Call Request"),d.createElement(O,null,d.createElement(b.a,null),d.createElement(I,null,"Approve or reject request using your wallet"))):c?d.createElement(S,null,d.createElement(j,null,"Call Request Approved"),d.createElement(C,null,d.createElement(N,null,d.createElement(U,null,"Method"),d.createElement(R,null,c.method)),c.body.map((e,t)=>d.createElement(N,{key:t},d.createElement(U,null,`Atomic group ${t}`),d.createElement(R,null,e.map((e,t)=>d.createElement("div",{key:t},!!(null===e||void 0===e?void 0:e.txID)&&d.createElement("p",null,"TxID: ",e.txID),!!(null===e||void 0===e?void 0:e.signature)&&d.createElement("p",null,"Sig: ",e.signature),!!(null===e||void 0===e?void 0:e.signingAddress)&&d.createElement("p",null,"AuthAddr: ",e.signingAddress))))))),d.createElement(k,{onClick:()=>this.submitSignedTransaction(),disabled:0!==r.length,style:{color:"red",backgroundColor:"lightblue",border:"5px",padding:"10px"}},"Submit transaction to network."),r.map((e,t)=>{const n=`${t}:${"number"===typeof e?e:"err"}`,i=`Txn Group ${t}: `;let o;return o=0===e?"Submitting...":"number"===typeof e?`Confirmed at round ${e}`:"Rejected by network. See console for more information.",d.createElement(j,{key:n},i+o)})):d.createElement(S,null,d.createElement(j,null,"Call Request Rejected"))))})}submitSignedTransaction(){return Object(i.__awaiter)(this,void 0,void 0,function*(){const{signedTxns:e,chain:t}=this.state;if(null==e)throw new Error("Transactions to submit are null");this.setState({pendingSubmissions:e.map(()=>0)}),e.forEach((e,n)=>Object(i.__awaiter)(this,void 0,void 0,function*(){try{const o=yield Object(y.d)(t,e);this.setState(e=>({pendingSubmissions:e.pendingSubmissions.map((e,t)=>n===t?o:e)})),console.log(`Transaction confirmed at round ${o}`)}catch(i){this.setState(e=>({pendingSubmissions:e.pendingSubmissions.map((e,t)=>n===t?i:e)})),console.error(`Error submitting transaction at index ${n}:`,i)}}))})}}}).call(this,n(15).Buffer)},182:function(e,t,n){e.exports=n.p+"static/media/algo.6c6f52b0.svg"},183:function(e,t,n){"use strict";var i=n(8),o=n(0),a=n(13),s=n(3),r=n(9);const c=s.b.div`
  transition: opacity 0.1s ease-in-out;
  text-align: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  margin-left: -50vw;
  top: ${({offset:e})=>e?`-${e}px`:0};
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({opacity:e})=>{let t=.4;return"number"===typeof e&&(t=e),`rgba(0, 0, 0, ${t})`}};
  opacity: ${({show:e})=>e?1:0};
  visibility: ${({show:e})=>e?"visible":"hidden"};
  pointer-events: ${({show:e})=>e?"auto":"none"};
  display: flex;
  justify-content: center;
  align-items: center;
`,l=s.b.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`,d=s.b.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,u=s.b.div`
  transition: ${r.e.short};
  position: absolute;
  width: ${({size:e})=>`${e}px`};
  height: ${({size:e})=>`${e}px`};
  right: ${({size:e})=>`${e/1.6667}px`};
  top: ${({size:e})=>`${e/1.6667}px`};
  opacity: 0.5;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  &:before,
  &:after {
    position: absolute;
    content: " ";
    height: ${({size:e})=>`${e}px`};
    width: 2px;
    background: ${({color:e})=>`rgb(${r.a[e]})`};
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`,p=s.b.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  padding: 25px;
  background-color: rgb(${r.a.white});
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`,g=s.b.div`
  position: relative;
  width: 100%;
  position: relative;
  word-wrap: break-word;
`,m={offset:0};class h extends o.Component{constructor(){super(...arguments),this.state=Object.assign({},m),this.toggleModal=(()=>Object(i.__awaiter)(this,void 0,void 0,function*(){const e="undefined"!==typeof window?document:"",t=e?e.body||e.getElementsByTagName("body")[0]:"";t&&(this.props.show?t.style.position="":t.style.position="fixed"),this.props.toggleModal()}))}componentDidUpdate(){if(this.lightbox){const e=this.lightbox.getBoundingClientRect(),t=e.top>0?e.top:0;t!==m.offset&&t!==this.state.offset&&this.setState({offset:t})}}render(){const{offset:e}=this.state,{children:t,show:n,opacity:i}=this.props;return o.createElement(c,{show:n,offset:e,opacity:i,ref:e=>this.lightbox=e},o.createElement(l,null,o.createElement(d,{onClick:this.toggleModal}),o.createElement(p,null,o.createElement(u,{size:25,color:"dark",onClick:this.toggleModal}),o.createElement(g,null,t))))}}h.propTypes={children:a.node.isRequired,show:a.bool.isRequired,toggleModal:a.func.isRequired,opacity:a.number},t.a=h},184:function(e,t,n){"use strict";var i=n(0),o=n(13),a=n(3);const s=a.c`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`,r=a.b.div`
  will-change: transform, opacity;
  animation: ${s} 0.7s ease 0s normal 1;
  min-height: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: ${({center:e})=>e?"center":"flex-start"};
`,c=e=>{const{children:t,center:n}=e;return i.createElement(r,Object.assign({},e,{center:n}),t)};c.propTypes={children:o.node.isRequired,center:o.bool},c.defaultProps={center:!1},t.a=c},186:function(e,t,n){"use strict";var i=n(0),o=n(28),a=n(3),s=n(13);const r=a.b.img`
  width: ${({size:e})=>`${e}px`};
  height: ${({size:e})=>`${e}px`};
`,c=e=>{const{src:t,fallback:n,size:o}=e;return i.createElement(r,Object.assign({},e,{src:t,size:o,onError:e=>{n&&(e.target.src=n)}}))};c.propTypes={src:s.string,fallback:s.string,size:s.number},c.defaultProps={src:null,fallback:"",size:20};var l=c;const d=e=>{const t=`https://algoexplorer.io/images/assets/big/light/${e.assetID}.png`;return i.createElement(l,{src:t})};d.propTypes={assetID:s.number,size:s.number},d.defaultProps={assetID:0,size:20};var u=d,p=n(182),g=n.n(p),m=n(64);const h=a.b.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`,b=a.b.div`
  display: flex;
`,f=a.b.div`
  display: flex;
  margin-left: 10px;
`,x=a.b.div`
  display: flex;
`,y=a.b.div`
  display: flex;
`;var w=e=>{const{asset:t}=e,n=0===t.id?g.a:null;return i.createElement(h,Object.assign({},e),i.createElement(b,null,n?i.createElement(l,{src:n}):i.createElement(u,{assetID:t.id}),i.createElement(f,null,t.name)),i.createElement(x,null,i.createElement(y,null,`${Object(m.b)(t.amount,t.decimals)} ${t.unitName||"units"}`)))};t.a=(e=>{const{assets:t}=e,n=t.find(e=>e&&0===e.id)||{id:0,amount:BigInt(0),creator:"",frozen:!1,decimals:6,name:"Algo",unitName:"Algo"},a=t.filter(e=>e&&0!==e.id);return i.createElement(o.a,{center:!0},i.createElement(w,{key:n.id,asset:n}),a.map(e=>i.createElement(w,{key:e.id,asset:e})))})},187:function(e,t,n){"use strict";var i=n(0),o=n(3),a=n(13);const s=o.b.div`
  width: ${({size:e})=>`${e}px`};
  height: ${({size:e})=>`${e}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
  & img {
    width: 100%;
  }
`,r=e=>{const t=e.address.toLowerCase()||"",n=window.blockies.create({seed:t}).toDataURL();return i.createElement(s,Object.assign({},e,{size:e.size}),i.createElement("img",{src:n,alt:e.address}))};r.defaultProps={address:"0x0000000000000000000000000000000000000000",size:30};var c=r,l=n(64),d=n(9),u=n(10);const p=o.b.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`,g=o.b.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`,m=Object(o.b)(g)`
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`,h=Object(o.b)(c)`
  margin-right: 10px;
`,b=o.b.p`
  transition: ${d.e.base};
  font-weight: bold;
  margin: ${({connected:e})=>e?"-2px auto 0.7em":"0"};
`,f=o.b.div`
  transition: ${d.e.button};
  font-size: 12px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  opacity: ${({connected:e})=>e?1:0};
  visibility: ${({connected:e})=>e?"visible":"hidden"};
  pointer-events: ${({connected:e})=>e?"auto":"none"};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`;const x=e=>{const{connected:t,address:n,killSession:o}=e;return i.createElement(p,Object.assign({},e),t&&i.createElement(m,null,i.createElement("p",null,"Connected to ",i.createElement("select",{onChange:t=>e.chainUpdate(function(e){switch(e){case u.a.MainNet.toString():return u.a.MainNet;case u.a.TestNet.toString():return u.a.TestNet;default:throw new Error(`Unknown chain selected: ${e}`)}}(t.target.value)),value:e.chain},i.createElement("option",{value:u.a.TestNet},"Algorand TestNet"),i.createElement("option",{value:u.a.MainNet},"Algorand MainNet")))),n&&i.createElement(g,null,i.createElement(h,{address:n}),i.createElement(b,{connected:t},Object(l.a)(n)),i.createElement(f,{connected:t,onClick:o},"Disconnect")))};x.propTypes={killSession:a.func.isRequired,address:a.string};t.a=x},188:function(e,t,n){e.exports=n(189)},189:function(e,t,n){"use strict";n.r(t);var i=n(0),o=n(168),a=n(3),s=n(169),r=n(9);const c=a.a`
  ${r.c}
`;o.render(i.createElement(i.Fragment,null,i.createElement(c,null),i.createElement(s.a,null)),document.getElementById("root"))},215:function(e,t){},259:function(e,t){},261:function(e,t){},272:function(e,t){},274:function(e,t){},28:function(e,t,n){"use strict";var i=n(0),o=n(13);const a=n(3).b.div`
  position: relative;
  width: 100%;
  height: ${({spanHeight:e})=>e?"100%":"auto"};
  max-width: ${({maxWidth:e})=>`${e}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({center:e})=>e?"center":"flex-start"};
`,s=e=>{const{children:t,spanHeight:n,maxWidth:o,center:s}=e;return i.createElement(a,Object.assign({},e,{spanHeight:n,maxWidth:o,center:s}),t)};s.propTypes={children:o.node.isRequired,spanHeight:o.bool,maxWidth:o.number,center:o.bool},s.defaultProps={spanHeight:!1,maxWidth:600,center:!1},t.a=s},301:function(e,t){},324:function(e,t){},55:function(e,t,n){"use strict";var i=n(0),o=n(13),a=n(3),s=n(9);const r=a.c`
  0% {
    transform: scale(1.0);
  }
  5% {
    transform: scale(1.0);
  }
  50% {
    transform: scale(0.8);
  }
  95% {
    transform: scale(1.0);
  }
  100% {
    transform: scale(1.0);
  }
`,c=a.b.svg`
  width: ${({size:e})=>`${e}px`};
  height: ${({size:e})=>`${e}px`};
  animation: ${r} 1s infinite cubic-bezier(0.25, 0, 0.75, 1);
  transform: translateZ(0);
`,l=e=>{const{size:t,color:n}=e,o=`rgb(${s.a[n]})`;return i.createElement(c,{viewBox:"0 0 186 187",size:t},i.createElement("g",{stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd"},i.createElement("path",{d:"M60,10.34375 C32.3857625,10.34375 10,32.7295125 10,60.34375 L10,126.34375 C10,153.957987 32.3857625,176.34375 60,176.34375 L126,176.34375 C153.614237,176.34375 176,153.957987 176,126.34375 L176,60.34375 C176,32.7295125 153.614237,10.34375 126,10.34375 L60,10.34375 Z M60,0.34375 L126,0.34375 C159.137085,0.34375 186,27.206665 186,60.34375 L186,126.34375 C186,159.480835 159.137085,186.34375 126,186.34375 L60,186.34375 C26.862915,186.34375 0,159.480835 0,126.34375 L0,60.34375 C0,27.206665 26.862915,0.34375 60,0.34375 Z",id:"Rectangle-Copy",fill:o,fillRule:"nonzero"}),i.createElement("rect",{id:"Rectangle",fill:o,x:"44",y:"44.34375",width:"98",height:"98",rx:"35"})))};l.propTypes={size:o.number,color:o.string},l.defaultProps={size:40,color:"lightBlue"},t.a=l},64:function(e,t,n){"use strict";function i(e="",t=6){return`${e.slice(0,t)}...${e.slice(-t)}`}function o(e,t){const n=BigInt("1"+"0".repeat(t)),i=e%n;return(e/n).toString()+"."+i.toString().padStart(t,"0")}n.d(t,"a",function(){return i}),n.d(t,"b",function(){return o})},89:function(e,t,n){"use strict";var i=n(0),o=n(3),a=n(55),s=n(9);const r=o.b.div`
  position: absolute;
  height: 15px;
  width: 15px;
  margin: 0 8px;
  top: calc((100% - 15px) / 2);
`,c=o.b.div`
  transition: ${s.e.button};
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(${s.a.white}, 0.1);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
`,l=o.b.button`
  transition: ${s.e.button};
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background-color: ${({outline:e,color:t})=>e?"transparent":`rgb(${s.a[t]})`};
  border: ${({outline:e,color:t})=>e?`1px solid rgb(${s.a[t]})`:"none"};
  color: ${({outline:e,color:t})=>e?`rgb(${s.a[t]})`:`rgb(${s.a.white})`};
  box-shadow: ${({outline:e})=>e?"none":`${s.d.soft}`};
  border-radius: 8px;
  font-size: ${s.b.size.medium};
  font-weight: ${s.b.weight.semibold};
  padding: ${({icon:e,left:t})=>e?t?"7px 12px 8px 28px":"7px 28px 8px 12px":"8px 12px"};
  cursor: ${({disabled:e})=>e?"auto":"pointer"};
  will-change: transform;

  &:disabled {
    opacity: 0.6;
    box-shadow: ${({outline:e})=>e?"none":`${s.d.soft}`};
  }

  @media (hover: hover) {
    &:hover {
      transform: ${({disabled:e})=>e?"none":"translateY(-1px)"};
      box-shadow: ${({disabled:e,outline:t})=>e?`${s.d.soft}`:t?"none":`${s.d.hover}`};
    }

    &:hover ${c} {
      opacity: 1;
      visibility: visible;
    }
  }

  &:active {
    transform: ${({disabled:e})=>e?"none":"translateY(1px)"};
    box-shadow: ${({outline:e})=>e?"none":`${s.d.soft}`};
    color: ${({outline:e,color:t})=>e?`rgb(${s.a[t]})`:`rgba(${s.a.white}, 0.24)`};

    & ${r} {
      opacity: 0.8;
    }
  }

  & ${r} {
    right: ${({left:e})=>e?"auto":"0"};
    left: ${({left:e})=>e?"0":"auto"};
    display: ${({icon:e})=>e?"block":"none"};
    mask: ${({icon:e})=>e?`url(${e}) center no-repeat`:"none"};
    background-color: ${({outline:e,color:t})=>e?`rgb(${s.a[t]})`:`rgb(${s.a.white})`};
    transition: 0.15s ease;
  }
`,d=e=>i.createElement(l,Object.assign({},e,{type:e.type,outline:e.outline,color:e.color,disabled:e.disabled,icon:e.icon,left:e.left}),i.createElement(c,null),i.createElement(r,null),e.fetching?i.createElement(a.a,{size:20,color:"white"}):e.children);d.defaultProps={fetching:!1,outline:!1,type:"button",color:"lightBlue",disabled:!1,icon:null,left:!1},t.a=d},9:function(e,t,n){"use strict";n.d(t,"a",function(){return i}),n.d(t,"b",function(){return o}),n.d(t,"e",function(){return a}),n.d(t,"d",function(){return s}),n.d(t,"c",function(){return r});const i={white:"255, 255, 255",black:"0, 0, 0",dark:"12, 12, 13",grey:"169, 169, 188",darkGrey:"113, 119, 138",lightGrey:"212, 212, 212",blue:"101, 127, 230",lightBlue:"64, 153, 255",yellow:"250, 188, 45",orange:"246, 133, 27",green:"84, 209, 146",pink:"255, 51, 102",red:"214, 75, 71",purple:"110, 107, 233"},o={size:{tiny:"10px",small:"14px",medium:"16px",large:"18px",h1:"60px",h2:"50px",h3:"40px",h4:"32px",h5:"24px",h6:"20px"},weight:{normal:400,medium:500,semibold:600,bold:700,extrabold:800},family:{OpenSans:'"Open Sans", sans-serif'}},a={short:"all 0.1s ease-in-out",base:"all 0.2s ease-in-out",long:"all 0.3s ease-in-out",button:"all 0.15s ease-in-out"},s={soft:"0 4px 6px 0 rgba(50, 50, 93, 0.11), 0 1px 3px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)",medium:"0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(50, 50, 93, 0.02), 0 5px 10px 0 rgba(59, 59, 92, 0.08)",big:"0 15px 35px 0 rgba(50, 50, 93, 0.06), 0 5px 15px 0 rgba(50, 50, 93, 0.15)",hover:"0 7px 14px 0 rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)"},r=`\n\n  html, body, #root {\n    height: 100%;\n    width: 100%;\n    margin: 0;\n    padding: 0;\n  }\n\n  body {\n    font-family: ${o.family.OpenSans};\n    font-style: normal;\n    font-stretch: normal;\n    font-weight: ${o.weight.normal};\n    font-size: ${o.size.medium};\n    background-color: rgb(${i.white});\n    color: rgb(${i.dark});\n    overflow-y:auto;\n    text-rendering: optimizeLegibility;\n    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  \t-webkit-text-size-adjust: 100%;\n    -webkit-overflow-scrolling: touch;\n    -ms-text-size-adjust: 100%;\n    -webkit-text-size-adjust: 100%;  \n  }\n\n  button {\n    border-style: none;\n    line-height: 1em;\n    background-image: none;\n    outline: 0;\n    -webkit-box-shadow: none;\n            box-shadow: none;\n  }\n\n  [tabindex] {\n    outline: none;\n    width: 100%;\n    height: 100%;\n  }\n\n  a, p, h1, h2, h3, h4, h5, h6 {\n  \ttext-decoration: none;\n  \tmargin: 0;\n    padding: 0;\n    margin: 0.7em 0;\n  }\n\n  h1 {\n    font-size: ${o.size.h1}\n  }\n  h2 {\n    font-size: ${o.size.h2}\n  }\n  h3 {\n    font-size: ${o.size.h3}\n  }\n  h4 {\n    font-size: ${o.size.h4}\n  }\n  h5 {\n    font-size: ${o.size.h5}\n  }\n  h6 {\n    font-size: ${o.size.h6}\n  }\n\n  a {\n    background-color: transparent;\n    -webkit-text-decoration-skip: objects;  \n    text-decoration: none;\n    color: inherit;\n    outline: none;\n  }\n\n  b,\n  strong {\n    font-weight: inherit;\n    font-weight: bolder;\n  }\n\n  ul, li {\n  \tlist-style: none;\n  \tmargin: 0;\n  \tpadding: 0;\n  }\n\n  * {\n    box-sizing: border-box !important;\n  }\n\n\n  input {\n    -webkit-appearance: none;\n  }\n\n  article,\n  aside,\n  details,\n  figcaption,\n  figure,\n  footer,\n  header,\n  main,\n  menu,\n  nav,\n  section,\n  summary {\n    display: block;\n  }\n  audio,\n  canvas,\n  progress,\n  video {\n    display: inline-block;\n  }\n\n  input[type="color"],\n  input[type="date"],\n  input[type="datetime"],\n  input[type="datetime-local"],\n  input[type="email"],\n  input[type="month"],\n  input[type="number"],\n  input[type="password"],\n  input[type="search"],\n  input[type="tel"],\n  input[type="text"],\n  input[type="time"],\n  input[type="url"],\n  input[type="week"],\n  select:focus,\n  textarea {\n    font-size: 16px;\n  }\n`},90:function(e,t,n){"use strict";(function(e){n.d(t,"b",function(){return c}),n.d(t,"a",function(){return p});var i=n(8),o=n(11),a=n.n(o),s=n(10);const r=[a.a.mnemonicToSecretKey("cannon scatter chest item way pulp seminar diesel width tooth enforce fire rug mushroom tube sustain glide apple radar chronic ask plastic brown ability badge"),a.a.mnemonicToSecretKey("person congress dragon morning road sweet horror famous bomb engine eager silent home slam civil type melt field dry daring wheel monitor custom above term"),a.a.mnemonicToSecretKey("faint protect home drink journey humble tube clinic game rough conduct sell violin discover limit lottery anger baby leaf mountain peasant rude scene abstract casual")];function c(e){const t=a.a.encodeAddress(e.from.publicKey);for(const n of r)if(n.addr===t)return e.signTxn(n.sk);throw new Error(`Cannot sign transaction from unknown test account: ${t}`)}function l(e){if(e===s.a.MainNet)return 31566704;if(e===s.a.TestNet)return 10458941;throw new Error(`Asset not defined for chain ${e}`)}function d(e){if(e===s.a.MainNet)return"2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM";if(e===s.a.TestNet)return"UJBZPEMXLD6KZOLUBUDSZ3DXECXYDADZZLBH6O7CMYXHE2PLTCW44VK5T4";throw new Error(`Asset reserve not defined for chain ${e}`)}function u(e){if(e===s.a.MainNet)return 305162725;if(e===s.a.TestNet)return 22314999;throw new Error(`App not defined for chain ${e}`)}const p=[{name:"1. Sign pay txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t);return[[{txn:a.a.makePaymentTxnWithSuggestedParamsFromObject({from:n,to:n,amount:1e5,note:new Uint8Array(e.from("example note value")),suggestedParams:i}),message:"This is a payment transaction that sends 0.1 Algos to yourself."}]]})},{name:"2. Sign asset opt-in txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t),o=l(t);return[[{txn:a.a.makeAssetTransferTxnWithSuggestedParamsFromObject({from:n,to:n,amount:0,assetIndex:o,note:new Uint8Array(e.from("example note value")),suggestedParams:i}),message:"This transaction opts you into the USDC asset if you have not already opted in."}]]})},{name:"3. Sign asset transfer txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t),o=l(t);return[[{txn:a.a.makeAssetTransferTxnWithSuggestedParamsFromObject({from:n,to:n,amount:1e6,assetIndex:o,note:new Uint8Array(e.from("example note value")),suggestedParams:i}),message:"This transaction will send 1 USDC to yourself."}]]})},{name:"4. Sign asset close out txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t),o=l(t);return[[{txn:a.a.makeAssetTransferTxnWithSuggestedParamsFromObject({from:n,to:d(t),amount:0,assetIndex:o,note:new Uint8Array(e.from("example note value")),closeRemainderTo:r[1].addr,suggestedParams:i}),message:"This transaction will opt you out of the USDC asset. DO NOT submit this to MainNet if you have more than 0 USDC."}]]})},{name:"5. Sign app opt-in txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t),o=u(t);return[[{txn:a.a.makeApplicationOptInTxnFromObject({from:n,appIndex:o,note:new Uint8Array(e.from("example note value")),appArgs:[Uint8Array.from([0]),Uint8Array.from([0,1])],suggestedParams:i}),message:"This transaction will opt you into a test app."}]]})},{name:"6. Sign app call txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t),o=u(t);return[[{txn:a.a.makeApplicationNoOpTxnFromObject({from:n,appIndex:o,note:new Uint8Array(e.from("example note value")),appArgs:[Uint8Array.from([0]),Uint8Array.from([0,1])],suggestedParams:i}),message:"This transaction will invoke an app call on a test app."}]]})},{name:"7. Sign app close out txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t),o=u(t);return[[{txn:a.a.makeApplicationCloseOutTxnFromObject({from:n,appIndex:o,note:new Uint8Array(e.from("example note value")),appArgs:[Uint8Array.from([0]),Uint8Array.from([0,1])],suggestedParams:i}),message:"This transaction will opt you out of the test app."}]]})},{name:"8. Sign app clear state txn",scenario:(t,n)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const i=yield Object(s.c)(t),o=u(t);return[[{txn:a.a.makeApplicationClearStateTxnFromObject({from:n,appIndex:o,note:new Uint8Array(e.from("example note value")),appArgs:[Uint8Array.from([0]),Uint8Array.from([0,1])],suggestedParams:i}),message:"This transaction will forcibly opt you out of the test app."}]]})},{name:"test Top Up IBFx txn",scenario:(t,n,o)=>Object(i.__awaiter)(void 0,void 0,void 0,function*(){const n=yield Object(s.c)(t),i=[];for(const t of o){const o=Uint8Array.from(e.from(t.algo_transaction,"base64")),s=a.a.decodeUnsignedTransaction(o);s.firstRound=n.firstRound,s.lastRound=n.lastRound,i.push({txn:s,message:"test",operation_id:t.operation_id})}return[i]})}]}).call(this,n(15).Buffer)}},[[188,2,1]]]);
//# sourceMappingURL=main.3dbf2baa.chunk.js.map