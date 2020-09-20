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
      </div>
    `,
    data() {
        return {
            open: false
        };
    }
});

var mintApp = new Vue({
    el: '#mintApp',
    data: {
        stage: 0,
        tokenType: "BTC",
        node: "http://localhost:4443",
        keyset: "",
        requestId: null
    },
    methods: {
        prepareMintRequest() {
            const d = new Date();
            const dStr = d.toISOString();
            const ks = {
                "pred": "keys-all",
                "keys": [
                    "df70f5cfce9aca4eb0759c0588b2e2ea0be743e313faec3639b6bd05f75d734f"
                ]
            };
            const code = '(kbtc.buy-token "asami" (read-keyset "ks") "' + dStr + '")';
            console.log(code);
            const cmd = {
                    "pactCode": code,
                    "envData": {"ks": ks}
            };
            // TODO properly get the chainwebversion and the chain ID
            //var res = Pact.fetch.local(cmd, this.node + '/chainweb/0.0/mainnet01/chain/0/pact');
            var res = Pact.fetch.local(cmd, this.node);
            res.then(v => {this.requestId = v.result.data['request-id'];});
            this.stage += 1;
        },

        sendMintRequest() {
            this.stage += 1;
        }
    }
});
