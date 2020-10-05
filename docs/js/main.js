var testtxb = {
    "keyset": {
        "pred": "keys-all",
        "keys": [
            "d17a42b42f76eb0fb3e400b5e06d763692ff44d7d9b4c05c8c21bac80085bad7"
        ]
    },
    "account": "susan",
    "chain": "0"
};
const testBtcAddress = '18saK8RSUfaF24wvwepLoQLT2wCJ8DazwJ';

Vue.component('btc-address-input', {
    props: ['value'],
    template: `
      <div v-bind:class="this.isError() ? 'attempted-submit' : ''">
        <input type="text"
               ref="rawAddress"
               v-bind:value="value"
               v-on:input="$emit('input', $event.target.value)"
               v-bind:class="this.isError() ? 'field-error' : ''">
      </div>
    `,
    methods: {
        isValidBtcAddress(v) {
            if ( v != null ) {
                var addr = v.match(/^[13][1-9abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ]{24,33}$/);
                return addr != null;
            } else {
                return false;
            }
        },
        isError: function() {
            const err = !this.isValidBtcAddress(this.value);
            const res = err && this.$refs.rawAddress != undefined && this.$refs.rawAddress.value != null && this.$refs.rawAddress.value != '';
            return res;
        }
    }
});

Vue.component('txb-input', {
    props: ['value'],
    template: `
      <div v-bind:class="this.isError() ? 'attempted-submit' : ''">
        <input type="text"
               ref="rawTxb"
               :value="txbToString(value)"
               @input="updateInput()"
               v-bind:class="this.isError() ? 'field-error' : ''">
      </div>
    `,
    methods: {
        stringToTxb(v) {
            var txb = null;
            try {
                var raw = JSON.parse(v);
                if ( raw != null ) {
                  if ( typeof raw.account === "undefined" ) {
                      throw "no account";
                  }
                    if ( typeof raw.keyset === "undefined" ) {
                        throw "no keyset";
                    }
                  if ( typeof raw.keyset.pred === "undefined" ) {
                      throw "no pred";
                  }
                  if ( typeof raw.keyset.keys === "undefined" ) {
                      throw "no keys";
                  }
                    txb = { "account": raw.account,
                            "keyset": raw.keyset
                          };
                }
            } catch (e) {
                if ( v != null ) {
                    var pubkey = v.match(/^[a-fA-F0-9]{64}$/);
                    if ( pubkey != null ) {
                        txb = { "account": v,
                                "keyset": { "keys": [v], "pred": "keys-all" }
                              };
                    }
                }
            }
            return txb;
        },
        txbToString(txb) {
            if ( txb == null )
                return '';
            else if ( txb.keyset.pred == "keys-all" && txb.keyset.keys.length == 1 && txb.keyset.keys[0] == txb.account ) {
                return txb.account;
            } else {
                return JSON.stringify(txb);
            }
        },
        updateInput() {
            this.$emit('input', this.stringToTxb(this.$refs.rawTxb.value));
        },
        isError: function() {
            return this.value == null && this.$refs.rawTxb != undefined && this.$refs.rawTxb.value != null && this.$refs.rawTxb.value != '';
        }
    }
});

Vue.component('site-nav', {
    props: [],
    // Manually disabled the updateNav function in scripts.js because the nav
    // would sometimes not be visible when it should. Added the attributes
    // "fixed outOfSight scrolled" here to compensate.
    template: `
		    <div class="nav-container">
            <nav class="absolute bg-dark fixed outOfSight scrolled">
		            <div class="nav-bar">
		                <div class="module left">
		                    <a href="index.html" class="inner-link">
                            <h3 style="height:55px;line-height:55px;">kda.link</h3>
		                    </a>
		                </div>
		                <div class="module widget-handle mobile-toggle right visible-sm visible-xs">
		                    <i class="ti-menu"></i>
		                </div>
		                <div class="module-group right">
		                    <div class="module left">
		                        <ul class="menu">
                                <li class="vpf">
		                                <a href="index.html">What is kda.link?</a>
		                            </li>
                                <li class="vpf">
		                                <a href="proof-of-assets.html">Proof of Assets</a>
		                            </li>
                                <li class="vpf">
		                                <a href="get-tokens.html">Get KTokens</a>
		                            </li>
                                <li class="vpf">
		                                <a href="redeem-tokens.html">Redeem KTokens</a>
		                            </li>
		                        </ul>
		                    </div>
		                </div>
		            </div>
		        </nav>
		    </div>
    `
});

Vue.component('site-footer', {
    props: [],
    // Manually disabled the updateNav function in scripts.js because the nav
    // would sometimes not be visible when it should. Added the attributes
    // "fixed outOfSight scrolled" here to compensate.
    template: `
      <footer class="footer-2 bg-dark text-center-xs">
			    <div class="container">
			        <div class="row">
			            <div class="col-sm-4">
                      <h3 style="height:55px;line-height:55px;">kda.link</h3>
			                <!-- <a href="#"><div class="vnu"><img class="image-xxs fade-half" alt="Pic" src="img/logo-light.png"></div></a> -->
			            </div>

			            <div class="col-sm-4 text-center">
			                <span class="fade-half">
			                    © Copyright 2020 kda.link - All Rights Reserved
			                </span>
			            </div>

			            <div class="col-sm-4 text-right text-center-xs">
			                <ul class="list-inline social-list">
			                    <li><a href="#"><i class="ti-twitter-alt"></i></a></li>
			                    <li><a href="#"><i class="ti ti-github"></i></a></li>
			                </ul>
			            </div>
			        </div>
			    </div>
			</footer>
    `
});

Vue.component('accordion', {
    props: {
        title: {
            type: String,
            required: true
        }
    },
    template: `
      <div>
          <div class="input-with-label text-left">
              <span v-on:click="open = !open" class="cursor-clickable">{{title}}
                  <i v-bind:class="open ? 'far fa-caret-square-down' : 'far fa-caret-square-right'"></i>
              </span>
          </div>

          <div v-bind:class="open ? '' : 'invisible'">
              <slot></slot>
          </div>
          <br/>
      </div>
    `,
    data() {
        return {
            open: false
        };
    }
});

const allTokens = {
    "BTC" : { "fee": 0.002, "min": 0.01, "address": "mgM9CyJ5PLxKcr1sEXsjR7G4hdUM9j1qpq" },
    "ETH" : { "fee": 0.002, "min": 0.3, "address": "not implemented yet" },
    "DAI" : { "fee": 0.002, "min": 100, "address": "not implemented yet" },
    "USDC" : { "fee": 0.002, "min": 100, "address": "not implemented yet" }
}

var app = new Vue({
    el: '#app'
});

var mintApp = new Vue({
    el: '#mintApp',
    data: {
        stage: 0,
        tokens: allTokens,
        tokenType: "BTC",
        node: "http://localhost:4443",
        txb: null,
        cmd: null,
        requestId: null,
        errMsg: null
    },
    computed: {
        sendToAddress() {
            return this.tokens[this.tokenType]["address"];
        },
        txFeePercent() {
            return this.tokens[this.tokenType]["fee"] * 100.0;
        },
        txMin() {
            return this.tokens[this.tokenType]["min"];
        }
    },
    methods: {
        prepareMintRequest() {
            const d = new Date();
            const dStr = d.toISOString();
            const code = '(kbtc.buy-token "' + this.txb.account + '" (read-keyset "ks") "' + dStr + '")';
            this.cmd = {
                    "pactCode": code,
                    "envData": {"ks": this.txb.keyset}
            };
            // TODO properly get the chainwebversion and the chain ID
            //var res = Pact.fetch.local(this.cmd, this.node + '/chainweb/0.0/mainnet01/chain/0/pact');
            var res = Pact.fetch.local(this.cmd, this.node);
            res.then(v => {this.requestId = v.result.data['request-id']; this.stage += 1;},
                     e => {this.errMsg = 'Error contacting node (' + e + ')'; });
        },
        sendMintRequest() {
            Pact.fetch.send(this.cmd, this.node);
            this.stage += 1;
        }
    }
});

var redeemApp = new Vue({
    el: '#redeemApp',
    data: {
        stage: 0,
        tokens: allTokens,
        tokenType: "BTC",
        node: "http://localhost:4443",
        sendingAccount: null,
        receivingAddress: null,
        amount: null,
        sendMax: false,
        cmd: null,
        accountDetails: null,
        errMsg: null,
        publicKey: null,
        selectedKeys: [],
        hash: null,
        sig: null,
        sigs: null
    },
    computed: {
        txFeePercent() {
            return this.tokens[this.tokenType]["fee"] * 100.0;
        },
        txMin() {
            console.log('here')
            return this.tokens[this.tokenType]["min"];
        }
    },
    methods: {
        localReady() {
            return this.txReady()
              && this.sigs !== null
        },
        sendReady() {
          //finish to set this up
          //must check localRedeem was positive
          return this.localReady()
        },
        txReady() {
          return this.receivingAddress != null
              && this.sendingAccount != null
              && this.errMsg === null
              && !isNaN(this.amount)
              && this.selectedKeys.length > 0
              && ((this.amount != null && this.amount != '') || this.sendMax);
        },
        maxAmount() {
          this.amount = this.accountDetails.balance;
        },
        convertDecimal(decimal) {
          decimal = decimal.toString();
          if (decimal[0] === ".") {return "0" + decimal}
          if (decimal.includes('.')) { return decimal }
          if ((decimal / Math.floor(decimal)) === 1) {
            decimal = decimal + ".0"
          }
          return decimal
        },
        mkReq(cmd) {
         return {
             headers: {
                 "Content-Type": "application/json"
             },
             method: "POST",
             body: JSON.stringify(cmd)
         };
        },
        isKeysetAmbiguous(ks) {
            const val = !(ks.pred == 'keys-all' || ks.keys.length == 1);
            console.log(ks);
            console.log('isKeysetAmbiguous returning ' + val);
            return val;
        },
        async prepareRedeem() {
            if (!this.txReady()) { return }
            const d = new Date();
            const dStr = d.toISOString();
            const code = `(kbtc.sell-token ${JSON.stringify(this.receivingAddress)} ${JSON.stringify(dStr)} ${JSON.stringify(this.sendingAccount)} ${this.convertDecimal(this.amount)})`
            const m = Pact.lang.mkMeta(this.sendingAccount, "0", 0.00001, 600, Math.round((new Date).getTime()/1000)-60, 28800);
            const sendCmd = {
                 pactCode: code,
                 // keyPairs: [{publicKey: this.publicKey, secretKey: null, clist: [{name: "coin.GAS", args: []}]}],
                 keyPairs: this.selectedKeys.map((key, i) => { return { publicKey: key, secretKey: null, clist: [] } }),
                 meta: m,
                 networkId: "blah",
            };
            this.cmd = Pact.simple.exec.createCommand( sendCmd.keyPairs, sendCmd.nonce, sendCmd.pactCode,
                                           sendCmd.envData, sendCmd.meta, sendCmd.networkId)
            this.hash = this.cmd.cmds[0].hash
            this.sigs = new Array(this.selectedKeys.length)
        },
        async localRedeem() {
          console.log(this.selectedKeys)
          var finalSigs = this.sigs
          finalSigs.map((sig, i) => {
            if (sig.length === 64) {
              const kp = {
                publicKey: this.selectedKeys[i],
                secretKey: sig
              }
              return Pact.crypto.sign(this.hash, kp)
            } else {
              return sig
            }
          })
          this.cmd.cmds[0].sigs = finalSigs
          console.log(this.cmd)
          const local = await fetch(`${this.node}/api/v1/local`, this.mkReq({cmds: this.cmd.cmds}));
          console.log(local)
        },
        async sendRedeem(){
          try {
            const send = await fetch(`${this.node}/api/v1/send`, this.mkReq({cmds: this.cmd.cmds}));
          } catch (e) {
            console.log(e)
          }
        },
        async getAccount() {
          try {
            var acctCmd = {
              "pactCode": `(kbtc.details ${JSON.stringify(this.sendingAccount)})`
            }
            var res  = await Pact.fetch.local(acctCmd, this.node)
            if (res.result.status === 'success') {
              this.accountDetails = res.result.data;
              console.log(res.result.data.guard.keys)
              this.errMsg = null;
            } else {
              this.errMsg = 'account does not exist';
              this.accountDetails = null;
            }
          } catch (e) {
            this.errMsg = 'account does not exist'
            this.accountDetails = null;
          }
        }
    },
});

var poaApp = new Vue({
  el: '#poaApp',
  data: {
    btcAmount: "loading...",
    btcAddress: allTokens["BTC"]["address"],
    kbtcAmount: "loading...",
    kbtcAddress: "kbtc",
    node: "http://localhost:4443",
  },
  computed: {
      btcLink() {
          return "https://blockstream.info/address/" + this.btcAddress;
      },
      kbtcLink() {
          return "https://explorer.chainweb.com/mainnet/chain/0/block/YoGUKi0Tq2Owg0nL7PDkcVLj6GTBSGCEUB-NQmmQn7U=/txs";
      }
  },
  methods: {
    async getBtcBalance() {
      try {
        //var res = await fetch('https://blockchain.info/de/q/addressbalance/' + this.btcAddress);
        // Hard code this for now so that we have a balance but aren't at risk of people sending to the wrong address.
        var res = await fetch('https://blockchain.info/de/q/addressbalance/35hK24tcLEWcgNA4JxpvbkNkoAcDGqQPsP');
        var amountSats = await res.json()
        this.btcAmount = amountSats / 1000000
      } catch (e) {
        this.btcAmount = 'Error contacting node (' + e + ')'
      }

    },
    async getKbtcCirculation() {
      //TODO implement get-total in smart contract
      const code = '(' + this.kbtcAddress + ".get-supply" + ')';
      const cmd = {
        "pactCode": code
      }
      try {
        var res = await Pact.fetch.local(cmd, this.node);
        this.kbtcAmount = res.result.data['supply']
      } catch (e) {
        this.kbtcAmount = 'Error contacting node (' + e + ')';
      }
    }
  },
  beforeMount(){
    this.getKbtcCirculation();
    this.getBtcBalance();
 },
})
