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
Vue.component('sitenav', {
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
    },
    computed: {
        txFeePercent() {
            return this.tokens[this.tokenType]["fee"] * 100.0;
        },
        txMin() {
            return this.tokens[this.tokenType]["min"];
        }
    },
    methods: {
        formValid() {
            return this.receivingAddress != null
                && this.sendingAccount != null
                && ((this.amount != null && this.amount != '') || this.sendMax);
        },
        prepareRedeem() {
            const d = new Date();
            const dStr = d.toISOString();
            const code = '(kbtc.sell-token "' + this.txb.account + '" (read-keyset "ks") "' + dStr + '")';
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
      const code = '(' + this.kbtcAddress + ".get-total" + ')';
      const cmd = {
        "pactCode": code
      }
      try {
        var res = await Pact.fetch.local(cmd, this.node);
        this.kbtcAmount = res.result.data['total-circulation']
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
