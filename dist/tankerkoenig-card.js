function t(t,e,s,i){var o,n=arguments.length,r=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,s,r):o(e,s))||r);return n>3&&r&&Object.defineProperty(e,s,r),r}console.groupCollapsed("%c⛽️ TANKERKOENIG CARD%cv1.1.1","color: orange; font-weight: bold; background: black; padding: 2px 4px; border-radius: 2px 0 0 2px;","color: white; font-weight: bold; background: dimgray; padding: 2px 4px; border-radius: 0 2px 2px 0;"),console.info("A Lovelace card to display German fuel prices from Tankerkönig."),console.info("Github:  https://github.com/timmaurice/lovelace-tankerkoenig-card.git"),console.info("Sponsor: https://buymeacoffee.com/timmaurice"),console.groupEnd(),"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new n("string"==typeof t?t:t+"",void 0,i),a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,i)},c=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,f=globalThis,_=f.trustedTypes,m=_?_.emptyScript:"",$=f.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(c(t))}else void 0!==t&&e.push(c(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,o=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??b)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[v("elementProperties")]=new Map,A[v("finalized")]=new Map,$?.({ReactiveElement:A}),(f.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,S=x.trustedTypes,k=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,z=`<${P}>`,O=document,T=()=>O.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,M="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,L=/"/g,V=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,K=O.createTreeWalker(O,129);function G(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=j;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,h=0;for(;h<s.length&&(r.lastIndex=h,c=r.exec(s),null!==c);)h=r.lastIndex,r===j?"!--"===c[1]?r=R:void 0!==c[1]?r=D:void 0!==c[2]?(V.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=o??j,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?H:'"'===c[3]?L:I):r===L||r===I?r=H:r===R||r===D?r=j:(r=H,o=void 0);const d=r===H&&t[e+1].startsWith("/>")?" ":"";n+=r===j?s+z:l>=0?(i.push(a),s.slice(0,l)+E+s.slice(l)+C+d):s+C+(-2===l?e:d)}return[G(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=Y.createElement(c,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=l[n++],s=i.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?et:"?"===r[1]?st:"@"===r[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(V.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),K.nextNode(),a.push({type:2,index:++o});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===F)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=N(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,i)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);K.currentNode=i;let o=K.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=K.nextNode(),n++)}return K.currentNode=O,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),N(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new J(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Y(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Q(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=Z(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==F,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Z(this,i[s+r],e,r),a===F&&(a=this._$AH[r]),n||=!N(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends tt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??q)===F)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(Y,Q),(x.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let at=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Q(e.insertBefore(T(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},dt=(t=ht,e,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,s)=>"object"==typeof s?dt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return pt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt=1;class ft{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _t=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ft{constructor(t){if(super(t),t.type!==gt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return F}});const mt={de:{editor:{groups:{core:"Grundeinstellungen",display:"Anzeige"},title:"Titel (Optional)",stations:"Tankstellen",show_address:"Adresse anzeigen",show_last_updated:"Zeitstempel der letzten Aktualisierung anzeigen",show_price_changes:"Preisänderungen anzeigen",fuel_types:"Reihenfolge der Kraftstoffarten",hide_unavailable_stations:"Nicht verfügbare Tankstellen ausblenden",sort_by:"Tankstellen nach Preis sortieren",show_only_cheapest:"Nur die günstigste Tankstelle anzeigen",fuel_type_options:{e5:"Super E5",e10:"Super E10",diesel:"Diesel"},sort_by_options:{none:"Keine"},add_station:"Tankstelle hinzufügen",customize:"Anpassen",remove:"Entfernen",station_name:"Stationsname (Optional)",logo_url:"Logo-URL (Optional)",logo_url_placeholder:"Pfad zu einem benutzerdefinierten Logo",save:"Speichern",cancel:"Abbrechen",tab_select:"Auswählen",tab_customize:"Anpassen"},card:{station_not_found:"Tankstelle nicht gefunden: {station}"}},en:{editor:{groups:{core:"Core Configuration",display:"Display"},title:"Title (Optional)",stations:"Station Entities",show_address:"Show Station Address",show_last_updated:"Show Last Updated Timestamp",show_price_changes:"Show Price Changes",fuel_types:"Fuel Types Order",hide_unavailable_stations:"Hide Unavailable Stations",sort_by:"Sort Stations by Price",show_only_cheapest:"Show Only Cheapest Station",fuel_type_options:{e5:"Super E5",e10:"Super E10",diesel:"Diesel"},sort_by_options:{none:"None"},add_station:"Add Station",customize:"Customize",remove:"Remove",station_name:"Station Name (Optional)",logo_url:"Logo URL (Optional)",logo_url_placeholder:"Path to a custom logo",save:"Save",cancel:"Cancel",tab_select:"Select",tab_customize:"Customize"},card:{station_not_found:"Station not found: {station}"}}};function $t(t,e){let s=mt[t];for(const t of e){if("object"!=typeof s||null===s)return;s=s[t]}return"string"==typeof s?s:void 0}function vt(t,e,s={}){const i=t.language||"en",o=e.replace("component.tankerkoenig-card.","").split("."),n=$t(i,o)??$t("en",o);if("string"==typeof n){let t=n;for(const e in s)t=t.replace(`{${e}}`,String(s[e]));return t}return e}const yt=(t,e,s,i)=>{const o=new CustomEvent(e,{bubbles:!0,cancelable:!1,composed:!0,...i,detail:s});t.dispatchEvent(o)};const bt="https://raw.githubusercontent.com/timmaurice/lovelace-tankerkoenig-card/main/src/gasstation_logos/";function wt(t){if(!t)return`${bt}404.png`;const e=t.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");return`${bt}${e}.png`}const At=a`﻿:host ::slotted(.card-content),.card-content{container-name:tankerkoenig-card;container-type:inline-size;display:flex;flex-direction:column;gap:12px;padding:16px}.warning{color:var(--error-color)}.station{align-items:center;display:flex;gap:12px}.station.closed{filter:grayscale(1);opacity:.5}.logo-container{flex-shrink:0}.logo-container .logo{height:40px;object-fit:contain;width:40px}.info{flex-grow:1;min-width:0}.row-1{overflow:hidden}.station-name{box-sizing:border-box;display:block;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.station-name:hover{animation:marquee 5s linear infinite;overflow:visible;width:fit-content}@keyframes marquee{0%{transform:translateX(0)}20%{transform:translateX(0)}100%{transform:translateX(calc(100px - 100%))}}.prices{display:flex;flex-direction:row;gap:8px;justify-content:flex-end;text-align:center;white-space:nowrap}.price-container{background-color:var(--divider-color);border-radius:4px;color:var(--primary-text-color);cursor:pointer;display:flex;flex-direction:column;padding:4px 8px}.price{font-family:"Digital-7","ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;font-size:1.5em;line-height:1;text-shadow:none}.fuel-header{align-items:center;display:flex;justify-content:center}.price sup{font-size:.6em}.currency{font-size:.7em;font-weight:normal;margin-left:2px;opacity:.7}.price-change-indicator{font-size:1em;margin:0 4px;vertical-align:middle}.price-change-indicator.price-up::after{color:var(--error-color);content:"▲"}.price-change-indicator.price-down::after{color:var(--success-color);content:"▼"}@container tankerkoenig-card (max-width: 400px){.prices{flex-direction:column}.price-container{flex-direction:row;justify-content:flex-end}}`,xt="tankerkoenig-card",St=`${xt}-editor`;let kt=class extends at{constructor(){super(...arguments),this._priceChanges={}}setConfig(t){if(!t||!t.stations||!Array.isArray(t.stations)||0===t.stations.length)throw new Error("You need to define at least one station entity");this._config=t}static async getConfigElement(){const t=await window.loadCardHelpers(),e=await t.createCardElement({type:"entities",entities:[]});return await e.constructor.getConfigElement(),await Promise.resolve().then(function(){return Ot}),document.createElement(St)}static getStubConfig(){return{title:"Tankerkönig",stations:[]}}getCardSize(){return 3}_getStations(t,e){const s={},i=Object.values(t.states);return e.stations.forEach(e=>{const o="string"==typeof e?e:e.device,n=i.filter(e=>t.entities[e.entity_id]?.device_id===o&&(e.entity_id.startsWith("sensor.")||e.entity_id.startsWith("binary_sensor.")));0!==n.length&&(s[o]||(s[o]={}),"string"!=typeof e&&e.logo&&(s[o].logo=e.logo),"string"!=typeof e&&e.name&&(s[o].name=e.name),n.forEach(t=>{const e=t.attributes.fuel_type;"e5"===e&&(s[o].e5=t.entity_id),"e10"===e&&(s[o].e10=t.entity_id),"diesel"===e&&(s[o].diesel=t.entity_id),t.entity_id.endsWith("_status")&&(s[o].status=t.entity_id)}))}),s}shouldUpdate(t){if(t.has("_config"))return!0;const e=t.get("hass");if(e){const t=this._getStations(this.hass,this._config),s=Object.values(t).flatMap(t=>Object.values(t));if(s.some(t=>t&&e.states[t]!==this.hass.states[t])||e.language!==this.hass.language)return this._fetchPriceChanges(),!0}return!0}_handleMoreInfo(t){yt(this,"hass-more-info",{entityId:t})}async _fetchPriceChanges(){if(!this._config||!this._config.show_price_changes)return;const t=this._getStations(this.hass,this._config),e=Object.values(t).flatMap(t=>[t.e5,t.e10,t.diesel]).filter(t=>!!t),s=new Date,i=new Date(s.getTime()-864e5);if(0===e.length)return;const o=await this.hass.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:s.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0,significant_changes_only:!1}),n={};for(const t of e){const e=o[t],s=Array.isArray(e)?e.filter(t=>t&&null!==t.s&&"unknown"!==t.s&&!isNaN(parseFloat(t.s))):[];if(s&&s.length>1){const e=s[s.length-1].s,i=s[s.length-2].s,o=parseFloat(e),r=parseFloat(i);isNaN(o)||isNaN(r)||(o>r?n[t]="up":o<r&&(n[t]="down"))}}this._priceChanges=n}render(){if(!this._config||!this.hass)return B``;const t=this._config.fuel_types||["diesel","e10","e5"],e={e5:{label:"E5"},e10:{label:"E10"},diesel:{label:"Diesel"}},s=this._config.sort_by;let i=Object.entries(this._getStations(this.hass,this._config));if(this._config.hide_unavailable_stations&&(i=i.filter(([,t])=>!t.status||"on"===this.hass.states[t.status].state)),s&&"none"!==s&&i.sort(([,t],[,e])=>{const i=t[s],o=e[s];if(!i)return 1;if(!o)return-1;const n=parseFloat(this.hass.states[i].state),r=parseFloat(this.hass.states[o].state);return isNaN(n)?1:isNaN(r)?-1:n-r}),this._config.show_only_cheapest&&s&&"none"!==s){const t=i.filter(([,t])=>{const e=t[s];return e&&!isNaN(parseFloat(this.hass.states[e].state))});if(t.length>0){const e=Math.min(...t.map(([,t])=>{const e=t[s];return parseFloat(this.hass.states[e].state)}));i=t.filter(([,t])=>{const i=t[s];return parseFloat(this.hass.states[i].state)===e})}}return B`
      <ha-card .header=${this._config.title} tabindex="0">
        <div class="card-content">
          ${i.map(([s,i])=>{const o=i.e5||i.e10||i.diesel||i.status;if(!o)return B`
                <div class="warning">
                  ${vt(this.hass,"component.tankerkoenig-card.card.station_not_found",{station:s})}
                </div>
              `;const n=!!i.status&&"on"===this.hass.states[i.status].state,r=this.hass.states[o],a=r.attributes,c=this.hass.devices[s],l=i.name||c?.name_by_user||c?.name||a.station_name||a.friendly_name,h=t=>t?t.toLowerCase().replace(/(?:^|\s|["'([{]|-)+\S/g,t=>t.toUpperCase()):"",d=a.house_number,p=[[h(a.street||""),d&&"none"!==d.toLowerCase()?d.trim():""].filter(Boolean).join(" "),[a.postcode||"",h(a.city||"")].filter(Boolean).join(" ")].filter(Boolean).join(", ");return B`
              <div class="station ${n?"open":"closed"}" tabindex="0">
                <div class="logo-container">
                  ${B`<img
                    class="logo"
                    src="${i.logo||wt(a.brand)}"
                    alt="${a.brand}"
                    @error=${t=>t.target.src=wt()}
                  />`}
                </div>
                <div class="info">
                  <div class="row-1">
                    <span class="station-name">${l}</span>
                  </div>
                  ${this._config.show_address?B`<div class="row-2"><span class="address">${p}</span></div>`:""}
                  ${this._config.show_last_updated?B`<div class="row-3">
                        <span class="last-updated">${function(t,e){const s=new Date(t),i=new Date,o={hour:"numeric",minute:"2-digit"};return s.getDate()===i.getDate()&&s.getMonth()===i.getMonth()&&s.getFullYear()===i.getFullYear()||Object.assign(o,{year:"numeric",month:"short",day:"2-digit"}),"12"===e.locale?.time_format&&(o.hour12=!0),s.toLocaleString(e.language,o)}(r.last_updated,this.hass)}</span>
                      </div>`:""}
                </div>
                <div class="prices">
                  ${t.map(t=>{const s=i[t];if(!s)return"";const o=this.hass.states[s],n="unavailable"===o.state||isNaN(parseFloat(o.state));let r="-.--",a="-";const c=o.attributes.unit_of_measurement||"";if(!n){const t=o.state.split(".");r=`${t[0]}.${t[1].substring(0,2)}`,a=t[1].substring(2,3)}const l=this._config.show_price_changes&&!n&&this._priceChanges[s]||"";return B`<div
                      class="price-container"
                      @click=${()=>this._handleMoreInfo(s)}
                      tabindex="0"
                    >
                      <div class="fuel-header">
                        <span class="fuel-type">${e[t].label}</span>
                        <span
                          class="price-change-indicator ${_t({"price-up":"up"===l,"price-down":"down"===l})}"
                        ></span>
                      </div>
                      <span class="price"
                        >${r}<sup>${a}</sup><span class="currency">${c}</span></span
                      >
                    </div>`})}
                </div>
              </div>
            `})}
        </div>
      </ha-card>
    `}firstUpdated(){this._fetchPriceChanges()}static{this.styles=a`
    ${r(At)}
  `}};t([pt({attribute:!1})],kt.prototype,"hass",void 0),t([
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function(t){return(e,s,i)=>((t,e,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,s),s))(e,s,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}("ha-card")],kt.prototype,"_card",void 0),t([ut()],kt.prototype,"_config",void 0),t([ut()],kt.prototype,"_priceChanges",void 0),kt=t([lt(xt)],kt),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:xt,name:"Tankerkönig Card",description:"A Lovelace card to display German fuel prices from Tankerkönig.",documentationURL:"https://github.com/timmaurice/lovelace-tankerkoenig-card"}));const Et=a`.card-config{display:flex;flex-direction:column;gap:12px}.group{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 4px);margin-top:8px;padding:16px}.group-header{color:var(--primary-text-color);font-size:16px;font-weight:500;margin-bottom:12px}.row{align-items:center;display:flex;flex-direction:row;gap:16px}.row>*{flex:1 1 50%;min-width:0}ha-formfield{align-items:center;display:flex;justify-content:space-between;padding-bottom:8px}.station-row{align-items:center;display:flex;gap:8px;margin-bottom:8px}.station-row .logo{border-radius:4px;flex-shrink:0;height:32px;object-fit:contain;width:32px}.station-row .station-name{flex-grow:1;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.add-icon{margin-right:8px}.tabs{border-bottom:1px solid var(--divider-color);display:flex}.tab-content{padding-top:16px}.tab{color:var(--secondary-text-color);cursor:pointer;padding:12px 16px;position:relative}.tab.active{border-bottom:2px solid var(--primary-color);color:var(--primary-text-color);margin-bottom:-1px}.search-bar{padding:0 24px}ha-textfield{width:100%}.device-list{margin-top:16px;max-height:400px;overflow-y:auto}ha-dialog{--mdc-dialog-min-width: 400px;--mdc-dialog-max-width: 500px}ha-dialog ha-textfield{display:block;margin-bottom:16px}ha-dialog button{background-color:rgba(0,0,0,0);border:none;border-radius:4px;color:var(--primary-color);cursor:pointer;height:36px;padding:0 8px;text-transform:uppercase}ha-dialog button:hover{background-color:rgba(var(--rgb-primary-color), 0.04)}ha-dialog button[slot=primaryAction]{background-color:var(--primary-color);color:var(--text-primary-color)}`,Ct=[{name:"title",selector:{text:{}}}],Pt=[{name:"stations",selector:{device:{multiple:!0,integration:"tankerkoenig"}}}];let zt=class extends at{constructor(){super(...arguments),this._dialogParams={},this._customizeInputValue="",this._customizeNameInputValue="",this._selectedTab=0}setConfig(t){this._config=t}_valueChanged(t){if(!this.hass||!this._config)return;const e=(t.detail.value.stations||[]).map(t=>this._config.stations.find(e=>("string"==typeof e?e:e.device)===t)||t),s={...this._config,...t.detail.value,stations:e};yt(this,"config-changed",{config:s})}_updateStation(t,e){if(!this._config)return;const s=[...this._config.stations];s[t]=e;const i={...this._config,stations:s};yt(this,"config-changed",{config:i})}_removeStation(t){if(!this._config)return;const e=[...this._config.stations];e.splice(t,1);const s={...this._config,stations:e};yt(this,"config-changed",{config:s})}render(){if(!this.hass||!this._config)return B``;let t=[{name:"show_address",selector:{boolean:{}}},{name:"show_last_updated",selector:{boolean:{}}},{name:"show_price_changes",selector:{boolean:{}}},{name:"hide_unavailable_stations",selector:{boolean:{}}},{name:"fuel_types",selector:{select:{multiple:!0,mode:"list",options:[{value:"diesel",label:vt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.diesel")},{value:"e10",label:vt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e10")},{value:"e5",label:vt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e5")}]}}},{name:"sort_by",selector:{select:{mode:"dropdown",options:[{value:"none",label:vt(this.hass,"component.tankerkoenig-card.editor.sort_by_options.none")},{value:"diesel",label:vt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.diesel")},{value:"e10",label:vt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e10")},{value:"e5",label:vt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e5")}]}}},{name:"show_only_cheapest",selector:{boolean:{}}}];return this._config.sort_by&&"none"!==this._config.sort_by||(t=t.filter(t=>"show_only_cheapest"!==t.name)),B`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${vt(this.hass,"component.tankerkoenig-card.editor.groups.core")}</div>
            <ha-form
              .schema=${Ct}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${t=>vt(this.hass,`component.tankerkoenig-card.editor.${t.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
          </div>

          <div class="group">
            <div class="group-header">${vt(this.hass,"component.tankerkoenig-card.editor.stations")}</div>
            <!-- Tabs -->
            <div class="tabs">
              <div class="tab ${0===this._selectedTab?"active":""}" @click=${()=>this._selectedTab=0}>
                ${vt(this.hass,"component.tankerkoenig-card.editor.tab_select")}
              </div>
              <div class="tab ${1===this._selectedTab?"active":""}" @click=${()=>this._selectedTab=1}>
                ${vt(this.hass,"component.tankerkoenig-card.editor.tab_customize")}
              </div>
            </div>

            <div class="tab-content">
              ${0===this._selectedTab?B` <ha-form
                    .schema=${Pt}
                    .hass=${this.hass}
                    .data=${{stations:(this._config.stations||[]).map(t=>"string"==typeof t?t:t.device)}}
                    .computeLabel=${t=>vt(this.hass,`component.tankerkoenig-card.editor.${t.name}`)}
                    @value-changed=${this._valueChanged}
                  ></ha-form>`:B` ${(this._config.stations||[]).map((t,e)=>this._renderStation(t,e))} `}
            </div>
          </div>

          <div class="group">
            <div class="group-header">${vt(this.hass,"component.tankerkoenig-card.editor.groups.display")}</div>
            <ha-form
              .schema=${t}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${t=>vt(this.hass,`component.tankerkoenig-card.editor.${t.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
          </div>
        </div>

        ${this._renderCustomizeDialog()}
      </ha-card>
    `}_renderStation(t,e){const s="string"==typeof t?t:t.device,i="object"==typeof t?t.logo:void 0,o="object"==typeof t?t.name:void 0,n=this.hass.devices[s],r=o||n?.name_by_user||n?.name||`Station ${e+1}`,a=wt(this._getBrandFromDevice(s));return B`
      <div class="station-row">
        <img
          class="logo"
          src="${i||a}"
          @error=${t=>t.target.src=wt()}
        />
        <span class="station-name">${r}</span>
        <ha-icon-button
          .label=${vt(this.hass,"component.tankerkoenig-card.editor.customize")}
          @click=${()=>this._showCustomizeDialog(t,e)}
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          .label=${vt(this.hass,"component.tankerkoenig-card.editor.remove")}
          @click=${()=>this._removeStation(e)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `}_showCustomizeDialog(t,e){console.log("[Tankerkoenig Editor] Firing show-dialog for CustomizeDialog");const s="string"==typeof t?t:t.device;this._customizeInputValue="object"==typeof t&&t.logo||"",this._customizeNameInputValue="object"==typeof t&&t.name||"",this._dialogParams={index:e,station:t,deviceId:s},this.shadowRoot?.querySelector("#customize-dialog")?.show()}_getBrandFromDevice(t){const e=Object.values(this.hass.states).find(e=>this.hass.entities[e.entity_id]?.device_id===t&&["e5","e10","diesel"].includes(e.attributes.fuel_type)),s=e?.attributes.brand;return"string"==typeof s&&"none"!==s.toLowerCase()?s:void 0}_renderCustomizeDialog(){return B`
      <ha-dialog
        id="customize-dialog"
        .heading=${vt(this.hass,"component.tankerkoenig-card.editor.customize")}
        @closed=${t=>{"confirm"===t.detail.action?this._confirmCustomize():(this._customizeInputValue="",this._customizeNameInputValue="")}}
      >
        <div>
          <ha-textfield
            .label=${vt(this.hass,"component.tankerkoenig-card.editor.station_name")}
            .value=${this._customizeNameInputValue}
            @input=${t=>this._customizeNameInputValue=t.target.value}
          ></ha-textfield>
          <ha-textfield
            .label=${vt(this.hass,"component.tankerkoenig-card.editor.logo_url")}
            .placeholder=${vt(this.hass,"component.tankerkoenig-card.editor.logo_url_placeholder")}
            .value=${this._customizeInputValue}
            @input=${t=>this._customizeInputValue=t.target.value}
          ></ha-textfield>
        </div>
        <button slot="primaryAction" dialogAction="confirm">
          ${vt(this.hass,"component.tankerkoenig-card.editor.save")}
        </button>
        <button slot="secondaryAction" dialogAction="cancel">
          ${vt(this.hass,"component.tankerkoenig-card.editor.cancel")}
        </button>
      </ha-dialog>
    `}_confirmCustomize(){const{index:t,deviceId:e,station:s}=this._dialogParams,i=this._customizeInputValue,o=this._customizeNameInputValue;if(void 0!==t&&void 0!==e&&void 0!==s)if(o||i){const s={device:e};o&&(s.name=o),i&&(s.logo=i),this._updateStation(t,s)}else this._updateStation(t,e)}static{this.styles=a`
    ${r(Et)}
  `}};t([pt({attribute:!1})],zt.prototype,"hass",void 0),t([ut()],zt.prototype,"_config",void 0),t([ut()],zt.prototype,"_dialogParams",void 0),t([ut()],zt.prototype,"_customizeInputValue",void 0),t([ut()],zt.prototype,"_customizeNameInputValue",void 0),t([ut()],zt.prototype,"_selectedTab",void 0),zt=t([lt("tankerkoenig-card-editor")],zt);var Ot=Object.freeze({__proto__:null,get TankerkoenigCardEditor(){return zt}});export{kt as TankerkoenigCard};
