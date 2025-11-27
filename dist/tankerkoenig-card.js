function t(t,e,s,o){var i,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(r=(n<3?i(r):n>3?i(e,s,r):i(e,s))||r);return n>3&&r&&Object.defineProperty(e,s,r),r}console.groupCollapsed("%c⛽️ TANKERKOENIG CARD%cv1.3.2","color: orange; font-weight: bold; background: black; padding: 2px 4px; border-radius: 2px 0 0 2px;","color: white; font-weight: bold; background: dimgray; padding: 2px 4px; border-radius: 0 2px 2px 0;"),console.info("A Lovelace card to display German fuel prices from Tankerkönig."),console.info("Github:  https://github.com/timmaurice/lovelace-tankerkoenig-card.git"),console.info("Sponsor: https://buymeacoffee.com/timmaurice"),console.groupEnd(),"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=i.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&i.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new n("string"==typeof t?t:t+"",void 0,o),a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n(s,t,o)},c=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,f=globalThis,_=f.trustedTypes,m=_?_.emptyScript:"",v=f.reactiveElementPolyfillSupport,b=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(t,s,e);void 0!==o&&d(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){const{get:o,set:i}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);i?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(c(t))}else void 0!==t&&e.push(c(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(s)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of o){const o=document.createElement("style"),i=e.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=s.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(void 0!==o&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,o=s._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=s.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const n=i.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const o=this.constructor,i=this[t];if(s??=o.getPropertyOptions(t),!((s.hasChanged??$)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:i},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==i||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,s,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,v?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k=globalThis,A=k.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,z=`<${P}>`,O=document,M=()=>O.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,U="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,R=/>/g,H=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,V=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,K=O.createTreeWalker(O,129);function G(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,o=[];let i,n=2===e?"<svg>":3===e?"<math>":"",r=j;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,d=0;for(;d<s.length&&(r.lastIndex=d,c=r.exec(s),null!==c);)d=r.lastIndex,r===j?"!--"===c[1]?r=L:void 0!==c[1]?r=R:void 0!==c[2]?(V.test(c[2])&&(i=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=i??j,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?H:'"'===c[3]?I:D):r===I||r===D?r=H:r===L||r===R?r=j:(r=H,i=void 0);const h=r===H&&t[e+1].startsWith("/>")?" ":"";n+=r===j?s+z:l>=0?(o.push(a),s.slice(0,l)+E+s.slice(l)+C+h):s+C+(-2===l?e:h)}return[G(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Y{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let i=0,n=0;const r=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=Y.createElement(c,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=K.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(E)){const e=l[n++],s=o.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:r[2],strings:s,ctor:"."===r[1]?et:"?"===r[1]?st:"@"===r[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:i}),o.removeAttribute(t));if(V.test(o.tagName)){const t=o.textContent.split(C),e=t.length-1;if(e>0){o.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)o.append(t[s],M()),K.nextNode(),a.push({type:2,index:++i});o.append(t[e],M())}}}else if(8===o.nodeType)if(o.data===P)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=o.data.indexOf(C,t+1));)a.push({type:7,index:i}),t+=C.length-1}i++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,o){if(e===B)return e;let i=void 0!==o?s._$Co?.[o]:s._$Cl;const n=N(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(t),i._$AT(t,s,o)),void 0!==o?(s._$Co??=[])[o]=i:s._$Cl=i),void 0!==i&&(e=Z(t,i._$AS(t,e.values),i,o)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??O).importNode(e,!0);K.currentNode=o;let i=K.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new it(i,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(i=K.nextNode(),n++)}return K.currentNode=O,o}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),N(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new J(o,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Y(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,o=0;for(const i of t)o===e.length?e.push(s=new Q(this.O(M()),this.O(M()),this,this.options)):s=e[o],s._$AI(i),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,i){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,o){const i=this.strings;let n=!1;if(void 0===i)t=Z(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const o=t;let r,a;for(t=i[0],r=0;r<i.length-1;r++)a=Z(this,o[s+r],e,r),a===B&&(a=this._$AH[r]),n||=!N(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+i[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class ot extends tt{constructor(t,e,s,o,i){super(t,e,s,o,i),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??q)===B)return;const s=this._$AH,o=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==q&&(s===q||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=k.litHtmlPolyfillSupport;nt?.(Y,Q),(k.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let at=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const o=s?.renderBefore??e;let i=o._$litPart$;if(void 0===i){const t=s?.renderBefore??null;o._$litPart$=i=new Q(e.insertBefore(M(),t),t,void 0,s??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ht=(t=dt,e,s)=>{const{kind:o,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===o){const{name:o}=s;return{set(s){const i=e.get.call(this);e.set.call(this,s),this.requestUpdate(o,i,t)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=s;return function(s){const i=this[o];e.call(this,s),this.requestUpdate(o,i,t)}}throw Error("Unsupported decorator location: "+o)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,s)=>"object"==typeof s?ht(t,e,s):((t,e,s)=>{const o=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),o?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
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
const gt=1,ft=t=>(...e)=>({_$litDirective$:t,values:e});let _t=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt="important",vt=" !"+mt,bt=ft(class extends _t{constructor(t){if(super(t),t.type!==gt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,s)=>{const o=t[s];return null==o?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in e){const o=e[t];if(null!=o){this.ft.add(t);const e="string"==typeof o&&o.endsWith(vt);t.includes("-")||e?s.setProperty(t,e?o.slice(0,-11):o,e?mt:""):s[t]=o}}return B}}),yt=ft(class extends _t{constructor(t){if(super(t),t.type!==gt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const o=!!e[t];o===this.st.has(t)||this.nt?.has(t)||(o?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return B}});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t={de:{editor:{groups:{core:"Grundeinstellungen",display:"Anzeige",address:"Adresseinstellungen",font:"Schriftarteinstellungen",color:"Farbeinstellungen"},title:"Titel (Optional)",stations:"Tankstellen",show_street:"Straße anzeigen",show_postcode:"Postleitzahl anzeigen",show_city:"Stadt anzeigen",show_last_updated:"Zeitstempel der letzten Aktualisierung anzeigen",show_price_changes:"Preisänderungen anzeigen",fuel_types:"Reihenfolge der Kraftstoffarten",hide_unavailable_stations:"Nicht verfügbare Tankstellen ausblenden",sort_by:"Tankstellen nach Preis sortieren",show_only_cheapest:"Nur die günstigste Tankstelle anzeigen",show_prices_side_by_side:"Preise nebeneinander anzeigen",font_scale:"Schriftgröße skalieren",price_bg_color:"Preis Hintergrundfarbe",price_font_color:"Preis Schriftfarbe",fuel_type_options:{e5:"Super E5",e10:"Super E10",diesel:"Diesel"},sort_by_options:{none:"Keine"},add_station:"Tankstelle hinzufügen",customize:"Anpassen",remove:"Entfernen",station_name:"Stationsname (Optional)",logo_url:"Logo-URL (Optional)",logo_url_placeholder:"Pfad zu einem benutzerdefinierten Logo",save:"Speichern",cancel:"Abbrechen",tab_select:"Auswählen",tab_customize:"Anpassen",show_address_info:"Adressanzeige",show_address_detail:"Jeder Schalter steuert die Sichtbarkeit eines Teils der Adresse. Wenn keiner ausgewählt ist, wird die Adresse ausgeblendet."},card:{station_not_found:"Tankstelle nicht gefunden: {station}"}},en:{editor:{groups:{core:"Core Configuration",display:"Display",address:"Address Settings",font:"Font Settings",color:"Color Settings"},title:"Title (Optional)",stations:"Station Entities",show_address:"Show Station Address",show_street:"Show Street",show_postcode:"Show Postcode",show_city:"Show City",show_last_updated:"Show Last Updated Timestamp",show_price_changes:"Show Price Changes",fuel_types:"Fuel Types Order",hide_unavailable_stations:"Hide Unavailable Stations",sort_by:"Sort Stations by Price",show_only_cheapest:"Show Only Cheapest Station",show_prices_side_by_side:"Show Prices Side-by-Side",font_scale:"Font Scale",price_bg_color:"Price Background Color",price_font_color:"Price Font Color",fuel_type_options:{e5:"Super E5",e10:"Super E10",diesel:"Diesel"},sort_by_options:{none:"None"},add_station:"Add Station",customize:"Customize",remove:"Remove",station_name:"Station Name (Optional)",logo_url:"Logo URL (Optional)",logo_url_placeholder:"Path to a custom logo",save:"Save",cancel:"Cancel",tab_select:"Select",tab_customize:"Customize",show_address_info:"Address Display",show_address_detail:"Each switch controls the visibility of a part of the address. If none are selected, the address will be hidden."},card:{station_not_found:"Station not found: {station}"}}};function xt(t,e){let s=$t[t];for(const t of e){if("object"!=typeof s||null===s)return;s=s[t]}return"string"==typeof s?s:void 0}function wt(t,e,s={}){const o=t.language||"en",i=e.replace("component.tankerkoenig-card.","").split("."),n=xt(o,i)??xt("en",i);if("string"==typeof n){let t=n;for(const e in s)t=t.replace(`{${e}}`,String(s[e]));return t}return e}const kt=(t,e,s,o)=>{const i=new CustomEvent(e,{bubbles:!0,cancelable:!1,composed:!0,...o,detail:s});t.dispatchEvent(i)};const At="https://raw.githubusercontent.com/timmaurice/lovelace-tankerkoenig-card/main/src/gasstation_logos/";function St(t){if(!t)return`${At}404.png`;const e=t.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");return`${At}${e}.png`}const Et=a`﻿:host ::slotted(.card-content),.card-content{container-name:tankerkoenig-card;container-type:inline-size;display:flex;flex-direction:column;gap:12px;padding:16px}.warning{color:var(--error-color)}.station{align-items:center;display:flex;gap:12px}.station.closed{filter:grayscale(1);opacity:.5}.logo-container{flex-shrink:0;line-height:0}.logo-container .logo{height:40px;object-fit:contain;width:40px}.info{flex-grow:1;min-width:0}.row-1{overflow:hidden}.station-name{box-sizing:border-box;display:block;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.station-name:hover{animation:marquee 5s linear infinite;overflow:visible;width:fit-content}@keyframes marquee{0%{transform:translateX(0)}20%{transform:translateX(0)}100%{transform:translateX(calc(100px - 100%))}}.prices{display:flex;flex-direction:row;gap:8px;justify-content:flex-end;text-align:center;white-space:nowrap}.price-container{background-color:var(--divider-color);border-radius:4px;color:var(--primary-text-color);cursor:pointer;display:flex;flex-direction:column;padding:4px 8px}.price{font-family:"Digital-7","ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;line-height:1;text-shadow:none}.fuel-header{align-items:center;display:flex;justify-content:center}.price sup{font-size:.6em}.currency{font-size:.7em;font-weight:normal;margin-left:2px;opacity:.7}.price-change-indicator{font-size:1em;margin:0 4px;vertical-align:middle}.price-change-indicator.price-up::after{color:var(--error-color);content:"▲"}.price-change-indicator.price-down::after{color:var(--success-color);content:"▼"}@container tankerkoenig-card (max-width: 400px){.prices{flex-direction:column}.price-container{flex-direction:row;justify-content:flex-end}.prices.prices-side-by-side{flex-direction:row}.prices.prices-side-by-side .price-container{flex-direction:column}}`,Ct="tankerkoenig-card",Pt=`${Ct}-editor`;let zt=class extends at{constructor(){super(...arguments),this._priceChanges={}}setConfig(t){if(!t||!t.stations||!Array.isArray(t.stations)||0===t.stations.length)throw new Error("You need to define at least one station entity");this._config=t}static async getConfigElement(){const t=await window.loadCardHelpers(),e=await t.createCardElement({type:"entities",entities:[]});return await e.constructor.getConfigElement(),await Promise.resolve().then(function(){return ce}),document.createElement(Pt)}static getStubConfig(){return{title:"Tankerkönig",stations:[],show_street:!0,show_postcode:!0,show_city:!0}}getCardSize(){return 3}_getStations(t,e){const s={},o=Object.values(t.states);return e.stations.forEach(e=>{const i="string"==typeof e?e:e.device,n=o.filter(e=>t.entities[e.entity_id]?.device_id===i&&(e.entity_id.startsWith("sensor.")||e.entity_id.startsWith("binary_sensor.")));0!==n.length&&(s[i]||(s[i]={}),"string"!=typeof e&&e.logo&&(s[i].logo=e.logo),"string"!=typeof e&&e.name&&(s[i].name=e.name),n.forEach(t=>{const e=t.attributes.fuel_type;"e5"===e&&(s[i].e5=t.entity_id),"e10"===e&&(s[i].e10=t.entity_id),"diesel"===e&&(s[i].diesel=t.entity_id),t.entity_id.endsWith("_status")&&(s[i].status=t.entity_id)}))}),s}shouldUpdate(t){if(t.has("_config"))return!0;const e=t.get("hass");if(e){const t=this._getStations(this.hass,this._config),s=Object.values(t).flatMap(t=>Object.values(t));if(s.some(t=>t&&e.states[t]!==this.hass.states[t])||e.language!==this.hass.language)return this._fetchPriceChanges(),!0}return!0}_handleMoreInfo(t){kt(this,"hass-more-info",{entityId:t})}async _fetchPriceChanges(){if(!this._config||!this._config.show_price_changes)return;const t=this._getStations(this.hass,this._config),e=Object.values(t).flatMap(t=>[t.e5,t.e10,t.diesel]).filter(t=>!!t),s=new Date,o=new Date(s.getTime()-864e5);if(0===e.length)return;const i=await this.hass.callWS({type:"history/history_during_period",start_time:o.toISOString(),end_time:s.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0,significant_changes_only:!1}),n={};for(const t of e){const e=i[t],s=Array.isArray(e)?e.filter(t=>t&&null!==t.s&&"unknown"!==t.s&&!isNaN(parseFloat(t.s))):[];if(s&&s.length>1){const e=s[s.length-1].s,o=s[s.length-2].s,i=parseFloat(e),r=parseFloat(o);isNaN(i)||isNaN(r)||(i>r?n[t]="up":i<r&&(n[t]="down"))}}this._priceChanges=n}render(){if(!this._config||!this.hass)return F``;const t=this._config.fuel_types||["diesel","e10","e5"],e={e5:{label:"E5"},e10:{label:"E10"},diesel:{label:"Diesel"}},s=this._config.sort_by;let o=Object.entries(this._getStations(this.hass,this._config));if(this._config.hide_unavailable_stations&&(o=o.filter(([,t])=>!t.status||"on"===this.hass.states[t.status].state)),s&&"none"!==s&&o.sort(([,t],[,e])=>{const o=t[s],i=e[s];if(!o)return 1;if(!i)return-1;const n=parseFloat(this.hass.states[o].state),r=parseFloat(this.hass.states[i].state);return isNaN(n)?1:isNaN(r)?-1:n-r}),this._config.show_only_cheapest&&s&&"none"!==s){const t=o.filter(([,t])=>{const e=t[s];return e&&!isNaN(parseFloat(this.hass.states[e].state))});if(t.length>0){const e=Math.min(...t.map(([,t])=>{const e=t[s];return parseFloat(this.hass.states[e].state)}));o=t.filter(([,t])=>{const o=t[s];return parseFloat(this.hass.states[o].state)===e})}}return F`
      <ha-card .header=${this._config.title} tabindex="0">
        <div class="card-content">
          ${o.map(([s,o])=>{const i=o.e5||o.e10||o.diesel||o.status;if(!i)return F`
                <div class="warning">
                  ${wt(this.hass,"component.tankerkoenig-card.card.station_not_found",{station:s})}
                </div>
              `;const n=!!o.status&&"on"===this.hass.states[o.status].state,r=this.hass.states[i],a=r.attributes,c=this.hass.devices[s],l=o.name||c?.name_by_user||c?.name||a.station_name||a.friendly_name,d=t=>t?t.toLowerCase().replace(/(?:^|\s|["'([{]|-)+\S/g,t=>t.toUpperCase()):"",h=!1!==this._config.show_street,p=!1!==this._config.show_postcode,u=!1!==this._config.show_city,g=[];if(h){const t=d(a.street||""),e=a.house_number,s=[t,e&&"none"!==e.toLowerCase()?e.trim():""].filter(Boolean).join(" ");s&&g.push(s)}const f=[];p&&f.push(String(a.postcode)||""),u&&f.push(d(a.city||""));const _=f.filter(Boolean).join(" ");_&&g.push(_);const m=g.join(", ");return F`
              <div class="station ${n?"open":"closed"}" tabindex="0">
                <div class="logo-container">
                  ${F`<img
                    class="logo"
                    src=${o.logo||St(a.brand)}
                    alt=${a.brand}
                    @error=${t=>t.target.src=St()}
                  />`}
                </div>
                <div class="info">
                  <div class="row-1">
                    <span class="station-name">${l}</span>
                  </div>
                  ${m?F`<div class="row-2"><span class="address">${m}</span></div>`:""}
                  ${this._config.show_last_updated?F`<div class="row-3">
                        <span class="last-updated">${function(t,e){const s=new Date(t),o=new Date,i={hour:"numeric",minute:"2-digit"};return s.getDate()===o.getDate()&&s.getMonth()===o.getMonth()&&s.getFullYear()===o.getFullYear()||Object.assign(i,{year:"numeric",month:"short",day:"2-digit"}),"12"===e.locale?.time_format&&(i.hour12=!0),s.toLocaleString(e.language,i)}(r.last_updated,this.hass)}</span>
                      </div>`:""}
                </div>
                <div
                  class="prices ${yt({"prices-side-by-side":this._config.show_prices_side_by_side||!1})}"
                >
                  ${t.map(t=>{const s=o[t];if(!s)return"";const i=this.hass.states[s],n="unavailable"===i.state||isNaN(parseFloat(i.state));let r="-.--",a="-";const c=i.attributes.unit_of_measurement||"";if(!n){const t=i.state.split(".");r=`${t[0]}.${t[1].substring(0,2)}`,a=t[1].substring(2,3)}const l={"background-color":this._config.price_bg_color||"var(--divider-color)",color:this._config.price_font_color||"var(--primary-text-color)"},d=(this._config.font_scale||100)/100,h={"font-size":1.5*d+"em"},p={"font-size":1*d+"em"},u=this._config.show_price_changes&&!n&&this._priceChanges[s]||"";return F`<div
                      class="price-container"
                      style=${bt(l)}
                      @click=${()=>this._handleMoreInfo(s)}
                      tabindex="0"
                    >
                      <div class="fuel-header">
                        <span class="fuel-type" style=${bt(p)}
                          >${e[t].label}</span
                        >
                        <span
                          class="price-change-indicator ${yt({"price-up":"up"===u,"price-down":"down"===u})}"
                        ></span>
                      </div>
                      <span class="price" style=${bt(h)}
                        >${r}<sup>${a}</sup><span class="currency">${c}</span></span
                      >
                    </div>`})}
                </div>
              </div>
            `})}
        </div>
      </ha-card>
    `}firstUpdated(){this._fetchPriceChanges()}static{this.styles=a`
    ${r(Et)}
  `}};t([pt({attribute:!1})],zt.prototype,"hass",void 0),t([
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function(t){return(e,s,o)=>((t,e,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,s),s))(e,s,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}("ha-card")],zt.prototype,"_card",void 0),t([ut()],zt.prototype,"_config",void 0),t([ut()],zt.prototype,"_priceChanges",void 0),zt=t([lt(Ct)],zt),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:Ct,name:"Tankerkönig Card",description:"A Lovelace card to display German fuel prices from Tankerkönig.",documentationURL:"https://github.com/timmaurice/lovelace-tankerkoenig-card"}));const Ot=(t,e=0,s=1)=>t>s?s:t<e?e:t,Mt=(t,e=0,s=Math.pow(10,e))=>Math.round(s*t)/s,Nt=({h:t,s:e,v:s,a:o})=>{const i=(200-e)*s/100;return{h:Mt(t),s:Mt(i>0&&i<200?e*s/100/(i<=100?i:200-i)*100:0),l:Mt(i/2),a:Mt(o,2)}},Tt=t=>{const{h:e,s:s,l:o}=Nt(t);return`hsl(${e}, ${s}%, ${o}%)`},Ut=t=>{const{h:e,s:s,l:o,a:i}=Nt(t);return`hsla(${e}, ${s}%, ${o}%, ${i})`},jt=({r:t,g:e,b:s,a:o})=>{const i=Math.max(t,e,s),n=i-Math.min(t,e,s),r=n?i===t?(e-s)/n:i===e?2+(s-t)/n:4+(t-e)/n:0;return{h:Mt(60*(r<0?r+6:r)),s:Mt(i?n/i*100:0),v:Mt(i/255*100),a:o}},Lt={},Rt=t=>{let e=Lt[t];return e||(e=document.createElement("template"),e.innerHTML=t,Lt[t]=e),e},Ht=(t,e,s)=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:s}))};let Dt=!1;const It=t=>"touches"in t,Vt=(t,e)=>{const s=It(e)?e.touches[0]:e,o=t.el.getBoundingClientRect();Ht(t.el,"move",t.getMove({x:Ot((s.pageX-(o.left+window.pageXOffset))/o.width),y:Ot((s.pageY-(o.top+window.pageYOffset))/o.height)}))};class Ft{constructor(t,e,s,o){const i=Rt(`<div role="slider" tabindex="0" part="${e}" ${s}><div part="${e}-pointer"></div></div>`);t.appendChild(i.content.cloneNode(!0));const n=t.querySelector(`[part=${e}]`);n.addEventListener("mousedown",this),n.addEventListener("touchstart",this),n.addEventListener("keydown",this),this.el=n,this.xy=o,this.nodes=[n.firstChild,n]}set dragging(t){const e=t?document.addEventListener:document.removeEventListener;e(Dt?"touchmove":"mousemove",this),e(Dt?"touchend":"mouseup",this)}handleEvent(t){switch(t.type){case"mousedown":case"touchstart":if(t.preventDefault(),!(t=>!(Dt&&!It(t)||(Dt||(Dt=It(t)),0)))(t)||!Dt&&0!=t.button)return;this.el.focus(),Vt(this,t),this.dragging=!0;break;case"mousemove":case"touchmove":t.preventDefault(),Vt(this,t);break;case"mouseup":case"touchend":this.dragging=!1;break;case"keydown":((t,e)=>{const s=e.keyCode;s>40||t.xy&&s<37||s<33||(e.preventDefault(),Ht(t.el,"move",t.getMove({x:39===s?.01:37===s?-.01:34===s?.05:33===s?-.05:35===s?1:36===s?-1:0,y:40===s?.01:38===s?-.01:0},!0)))})(this,t)}}style(t){t.forEach((t,e)=>{for(const s in t)this.nodes[e].style.setProperty(s,t[s])})}}class Bt extends Ft{constructor(t){super(t,"hue",'aria-label="Hue" aria-valuemin="0" aria-valuemax="360"',!1)}update({h:t}){this.h=t,this.style([{left:t/360*100+"%",color:Tt({h:t,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuenow",`${Mt(t)}`)}getMove(t,e){return{h:e?Ot(this.h+360*t.x,0,360):360*t.x}}}class qt extends Ft{constructor(t){super(t,"saturation",'aria-label="Color"',!0)}update(t){this.hsva=t,this.style([{top:100-t.v+"%",left:`${t.s}%`,color:Tt(t)},{"background-color":Tt({h:t.h,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuetext",`Saturation ${Mt(t.s)}%, Brightness ${Mt(t.v)}%`)}getMove(t,e){return{s:e?Ot(this.hsva.s+100*t.x,0,100):100*t.x,v:e?Ot(this.hsva.v-100*t.y,0,100):Math.round(100-100*t.y)}}}const Wt=Symbol("same"),Kt=Symbol("color"),Gt=Symbol("hsva"),Xt=Symbol("update"),Yt=Symbol("parts"),Zt=Symbol("css"),Jt=Symbol("sliders");class Qt extends HTMLElement{static get observedAttributes(){return["color"]}get[Zt](){return[':host{display:flex;flex-direction:column;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}:host([hidden]){display:none!important}[role=slider]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;outline:0}[role=slider]:last-child{border-radius:0 0 8px 8px}[part$=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;display:flex;place-content:center center;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}[part$=pointer]::after{content:"";width:100%;height:100%;border-radius:inherit;background-color:currentColor}[role=slider]:focus [part$=pointer]{transform:translate(-50%,-50%) scale(1.1)}',"[part=hue]{flex:0 0 24px;background:linear-gradient(to right,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red 100%)}[part=hue-pointer]{top:50%;z-index:2}","[part=saturation]{flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,rgba(255,255,255,0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part=saturation-pointer]{z-index:3}"]}get[Jt](){return[qt,Bt]}get color(){return this[Kt]}set color(t){if(!this[Wt](t)){const e=this.colorModel.toHsva(t);this[Xt](e),this[Kt]=t}}constructor(){super();const t=Rt(`<style>${this[Zt].join("")}</style>`),e=this.attachShadow({mode:"open"});e.appendChild(t.content.cloneNode(!0)),e.addEventListener("move",this),this[Yt]=this[Jt].map(t=>new t(e))}connectedCallback(){if(this.hasOwnProperty("color")){const t=this.color;delete this.color,this.color=t}else this.color||(this.color=this.colorModel.defaultColor)}attributeChangedCallback(t,e,s){const o=this.colorModel.fromAttr(s);this[Wt](o)||(this.color=o)}handleEvent(t){const e=this[Gt],s={...e,...t.detail};let o;this[Xt](s),((t,e)=>{if(t===e)return!0;for(const s in t)if(t[s]!==e[s])return!1;return!0})(s,e)||this[Wt](o=this.colorModel.fromHsva(s))||(this[Kt]=o,Ht(this,"color-changed",{value:o}))}[Wt](t){return this.color&&this.colorModel.equal(t,this.color)}[Xt](t){this[Gt]=t,this[Yt].forEach(e=>e.update(t))}}class te extends Ft{constructor(t){super(t,"alpha",'aria-label="Alpha" aria-valuemin="0" aria-valuemax="1"',!1)}update(t){this.hsva=t;const e=Ut({...t,a:0}),s=Ut({...t,a:1}),o=100*t.a;this.style([{left:`${o}%`,color:Ut(t)},{"--gradient":`linear-gradient(90deg, ${e}, ${s}`}]);const i=Mt(o);this.el.setAttribute("aria-valuenow",`${i}`),this.el.setAttribute("aria-valuetext",`${i}%`)}getMove(t,e){return{a:e?Ot(this.hsva.a+t.x):t.x}}}class ee extends Qt{get[Zt](){return[...super[Zt],'[part=alpha]{flex:0 0 24px}[part=alpha]::after{display:block;content:"";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:inherit;background-image:var(--gradient);box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part^=alpha]{background-color:#fff;background-image:url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>\')}[part=alpha-pointer]{top:50%}']}get[Jt](){return[...super[Jt],te]}}const se={defaultColor:"rgba(0, 0, 0, 1)",toHsva:t=>{const e=/rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i.exec(t);return e?jt({r:Number(e[1])/(e[2]?100/255:1),g:Number(e[3])/(e[4]?100/255:1),b:Number(e[5])/(e[6]?100/255:1),a:void 0===e[7]?1:Number(e[7])/(e[8]?100:1)}):{h:0,s:0,v:0,a:1}},fromHsva:t=>{const{r:e,g:s,b:o,a:i}=(({h:t,s:e,v:s,a:o})=>{t=t/360*6,e/=100,s/=100;const i=Math.floor(t),n=s*(1-e),r=s*(1-(t-i)*e),a=s*(1-(1-t+i)*e),c=i%6;return{r:Mt(255*[s,r,n,n,a,s][c]),g:Mt(255*[a,s,s,r,n,n][c]),b:Mt(255*[n,n,a,s,s,r][c]),a:Mt(o,2)}})(t);return`rgba(${e}, ${s}, ${o}, ${i})`},equal:(t,e)=>t.replace(/\s/g,"")===e.replace(/\s/g,""),fromAttr:t=>t};class oe extends ee{get colorModel(){return se}}const ie=a`.color-input-wrapper{position:relative;flex:1}.color-picker-popup{position:absolute;top:100%;left:0;z-index:10;padding:8px;background-color:var(--card-background-color, white);border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 4px);box-shadow:0px 5px 5px -3px rgba(0,0,0,.2),0px 8px 10px 1px rgba(0,0,0,.14),0px 3px 14px 2px rgba(0,0,0,.12)}.color-picker-popup rgb-string-color-picker{width:200px;height:200px}.color-preview{width:28px;height:28px;border-radius:4px;border:1px solid var(--divider-color);cursor:pointer;box-sizing:border-box}.card-config{display:flex;flex-direction:column;gap:var(--bge-editor-spacing, 12px)}.color-picker-popup{display:none}.color-input-wrapper{align-items:center;display:flex;gap:var(--bge-editor-spacing)}.color-input-wrapper ha-textfield{flex-grow:1;margin-right:calc(var(--bge-editor-spacing, 12px)/2)}.color-preview{border:1px solid var(--divider-color);border-radius:4px;box-sizing:border-box;cursor:pointer;flex-shrink:0;height:28px;width:28px}.group{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 12px);margin-top:0;padding:16px}.group.no-border{border:none;padding:0}.group-header{color:var(--primary-text-color);font-size:16px;font-weight:500;margin-bottom:12px}.row{align-items:center;display:flex;flex-direction:row;gap:16px}.row>*{flex:1 1 50%;min-width:0}ha-formfield{align-items:center;display:flex;justify-content:space-between;padding-bottom:8px}.station-row{align-items:center;display:flex;gap:8px;margin-bottom:8px}.station-row .logo{border-radius:4px;flex-shrink:0;height:32px;object-fit:contain;width:32px}.station-row .station-name{flex-grow:1;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.add-icon{margin-right:8px}.tabs{border-bottom:1px solid var(--divider-color);display:flex}.tab-content{padding-top:16px}.tab{color:var(--secondary-text-color);cursor:pointer;padding:12px 16px;position:relative}.tab.active{border-bottom:2px solid var(--primary-color);color:var(--primary-text-color);margin-bottom:-1px}.search-bar{padding:0 24px}ha-textfield{width:100%}.device-list{margin-top:16px;max-height:400px;overflow-y:auto}ha-dialog{--mdc-dialog-min-width: 400px;--mdc-dialog-max-width: 500px}ha-dialog ha-textfield{display:block;margin-bottom:16px}ha-dialog button{background-color:rgba(0,0,0,0);border:none;border-radius:4px;color:var(--primary-color);cursor:pointer;height:36px;padding:0 8px;text-transform:uppercase}ha-dialog button:hover{background-color:rgba(var(--rgb-primary-color), 0.04)}ha-dialog button[slot=primaryAction]{background-color:var(--primary-color);color:var(--text-primary-color)}.expansion-content{display:flex;flex-direction:column;gap:16px;padding:16px}ha-expansion-panel{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 12px);margin-top:8px}.font-scale-slider{display:flex;flex-direction:column}`;window.customElements.get("rgba-string-color-picker")||window.customElements.define("rgba-string-color-picker",class extends oe{});const ne=[{name:"title",selector:{text:{}}}],re=[{name:"stations",selector:{device:{multiple:!0,integration:"tankerkoenig"}}}];window.customElements.get("ha-expansion-panel")||window.customElements.define("ha-expansion-panel",class extends at{static{this.styles=a`
        ha-expansion-panel {
          display: block;
        }
      `}});let ae=class extends at{constructor(){super(...arguments),this._dialogParams={},this._customizeInputValue="",this._customizeNameInputValue="",this._selectedTab=0,this._activeColorPicker=null,this._addressExpanded=!1,this._fontExpanded=!1,this._colorExpanded=!1,this._handleOutsideClick=t=>{if(!this._activeColorPicker)return;const e=t.composedPath()[0];e.closest(".color-input-wrapper")||e.closest(".color-picker-popup")||this._closeActiveColorPicker()}}setConfig(t){this._config=t}_valueChanged(t){if(!this.hass||!this._config)return;const e={...t.detail.value};if(void 0!==t.detail.value.stations){const s=t.detail.value.stations||[];e.stations=s.map(t=>this._config.stations.find(e=>("string"==typeof e?e:e.device)===t)||t)}kt(this,"config-changed",{config:{...this._config,...e}})}_updateStation(t,e){if(!this._config)return;const s=[...this._config.stations];s[t]=e;const o={...this._config,stations:s};kt(this,"config-changed",{config:o})}_removeStation(t){if(!this._config)return;const e=[...this._config.stations];e.splice(t,1);const s={...this._config,stations:e};kt(this,"config-changed",{config:s})}connectedCallback(){super.connectedCallback(),document.addEventListener("mousedown",this._handleOutsideClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._handleOutsideClick)}_closeActiveColorPicker(){if(!this._activeColorPicker)return;const t=this.shadowRoot?.querySelectorAll(".color-picker-popup");t?.forEach(t=>t.style.display="none"),this._activeColorPicker=null}render(){if(!this.hass||!this._config)return F``;let t=[{name:"show_last_updated",selector:{boolean:{}}},{name:"show_price_changes",selector:{boolean:{}}},{name:"hide_unavailable_stations",selector:{boolean:{}}},{name:"fuel_types",selector:{select:{multiple:!0,mode:"list",options:[{value:"diesel",label:wt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.diesel")},{value:"e10",label:wt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e10")},{value:"e5",label:wt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e5")}]}}},{name:"sort_by",selector:{select:{mode:"dropdown",options:[{value:"none",label:wt(this.hass,"component.tankerkoenig-card.editor.sort_by_options.none")},{value:"diesel",label:wt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.diesel")},{value:"e10",label:wt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e10")},{value:"e5",label:wt(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e5")}]}}},{name:"show_only_cheapest",selector:{boolean:{}}},{name:"show_prices_side_by_side",selector:{boolean:{}}}];return this._config.sort_by&&"none"!==this._config.sort_by||(t=t.filter(t=>"show_only_cheapest"!==t.name)),F`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${wt(this.hass,"component.tankerkoenig-card.editor.groups.core")}</div>
            <ha-form
              .schema=${ne}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${t=>wt(this.hass,`component.tankerkoenig-card.editor.${t.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
          </div>

          <div class="group">
            <div class="group-header">${wt(this.hass,"component.tankerkoenig-card.editor.stations")}</div>
            <!-- Tabs -->
            <div class="tabs">
              <div class="tab ${0===this._selectedTab?"active":""}" @click=${()=>this._selectedTab=0}>
                ${wt(this.hass,"component.tankerkoenig-card.editor.tab_select")}
              </div>
              <div class="tab ${1===this._selectedTab?"active":""}" @click=${()=>this._selectedTab=1}>
                ${wt(this.hass,"component.tankerkoenig-card.editor.tab_customize")}
              </div>
            </div>

            <div class="tab-content">
              ${0===this._selectedTab?F` <ha-form
                    .schema=${re}
                    .hass=${this.hass}
                    .data=${{stations:(this._config.stations||[]).map(t=>"string"==typeof t?t:t.device)}}
                    .computeLabel=${t=>wt(this.hass,`component.tankerkoenig-card.editor.${t.name}`)}
                    @value-changed=${this._valueChanged}
                  ></ha-form>`:F` ${(this._config.stations||[]).map((t,e)=>this._renderStation(t,e))} `}
            </div>
          </div>

          <div class="group">
            <div class="group-header">${wt(this.hass,"component.tankerkoenig-card.editor.groups.display")}</div>
            <ha-form
              .schema=${t}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${t=>wt(this.hass,`component.tankerkoenig-card.editor.${t.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
            <ha-expansion-panel
              .header=${wt(this.hass,"component.tankerkoenig-card.editor.groups.address")}
              .expanded=${this._addressExpanded}
              @click=${t=>{t.target.classList.contains("expansion-panel-summary")&&(this._addressExpanded=!this._addressExpanded)}}
            >
              <div class="expansion-content">
                <ha-alert
                  alert-type="info"
                  .title=${wt(this.hass,"component.tankerkoenig-card.editor.show_address_info")}
                >
                  ${wt(this.hass,"component.tankerkoenig-card.editor.show_address_detail")}
                </ha-alert>
                <ha-form
                  .schema=${[{name:"show_street",selector:{boolean:{}}},{name:"show_postcode",selector:{boolean:{}}},{name:"show_city",selector:{boolean:{}}}]}
                  .hass=${this.hass}
                  .data=${{show_street:this._config.show_street??!0,show_postcode:this._config.show_postcode??!0,show_city:this._config.show_city??!0}}
                  .computeLabel=${t=>wt(this.hass,`component.tankerkoenig-card.editor.${t.name}`)}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
            </ha-expansion-panel>

            <ha-expansion-panel
              .header=${wt(this.hass,"component.tankerkoenig-card.editor.groups.font")}
              .expanded=${this._fontExpanded}
              @click=${t=>{t.target.classList.contains("expansion-panel-summary")&&(this._fontExpanded=!this._fontExpanded)}}
            >
              <div class="expansion-content">
                <div class="row">
                  <div class="font-scale-slider">
                    <label for="font_scale"
                      >${wt(this.hass,"component.tankerkoenig-card.editor.font_scale")}:
                      <span>${this._config.font_scale||100}%</span></label
                    >
                    <ha-slider
                      id="font_scale"
                      min="70"
                      max="120"
                      step="1"
                      .value=${this._config.font_scale||100}
                      @change=${t=>{const e={...this._config,font_scale:parseFloat(t.target.value)};kt(this,"config-changed",{config:e})}}
                    ></ha-slider>
                  </div>
                </div>
              </div>
            </ha-expansion-panel>
            <ha-expansion-panel
              .header=${wt(this.hass,"component.tankerkoenig-card.editor.groups.color")}
              .expanded=${this._colorExpanded}
              @click=${t=>{t.target.classList.contains("expansion-panel-summary")&&(this._colorExpanded=!this._colorExpanded)}}
            >
              <div class="expansion-content">
                <div class="row">
                  ${this._renderColorPicker("price_bg_color",wt(this.hass,"component.tankerkoenig-card.editor.price_bg_color"),this._config.price_bg_color||"var(--divider-color)")}
                  ${this._renderColorPicker("price_font_color",wt(this.hass,"component.tankerkoenig-card.editor.price_font_color"),this._config.price_font_color||"var(--primary-text-color)")}
                </div>
              </div>
            </ha-expansion-panel>
          </div>
        </div>

        ${this._renderCustomizeDialog()}
      </ha-card>
    `}_renderColorPicker(t,e,s){return F` <div class="color-input-wrapper">
      <ha-textfield
        .label=${e}
        .value=${this._config[t]||""}
        .configValue=${t}
        @input=${e=>{const s={...this._config,[t]:e.target.value};kt(this,"config-changed",{config:s})}}
      ></ha-textfield>
      <div
        class="color-preview"
        style="background-color: ${s}"
        @click=${e=>this._toggleColorPicker(e,String(t))}
      ></div>
      <div
        class="color-picker-popup"
        data-picker-id=${t}
        @mousedown=${t=>t.stopPropagation()}
      >
        <rgba-string-color-picker
          .color=${s}
          .configValue=${t}
          @color-changed=${e=>{const s={...this._config,[t]:e.detail.value};kt(this,"config-changed",{config:s})}}
        ></rgba-string-color-picker>
      </div>
    </div>`}_toggleColorPicker(t,e){t.stopPropagation();const s=this.shadowRoot?.querySelector(`.color-picker-popup[data-picker-id="${e}"]`);if(!s)return;const o=this._activeColorPicker===e;this._closeActiveColorPicker(),o||(s.style.display="block",this._activeColorPicker=e)}_renderStation(t,e){const s="string"==typeof t?t:t.device,o="object"==typeof t?t.logo:void 0,i="object"==typeof t?t.name:void 0,n=this.hass.devices[s],r=i||n?.name_by_user||n?.name||`Station ${e+1}`,a=St(this._getBrandFromDevice(s));return F`
      <div class="station-row">
        <img
          class="logo"
          src=${o||a}
          @error=${t=>t.target.src=St()}
        />
        <span class="station-name">${r}</span>
        <ha-icon-button
          .label=${wt(this.hass,"component.tankerkoenig-card.editor.customize")}
          @click=${()=>this._showCustomizeDialog(t,e)}
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          .label=${wt(this.hass,"component.tankerkoenig-card.editor.remove")}
          @click=${()=>this._removeStation(e)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `}_showCustomizeDialog(t,e){const s="string"==typeof t?t:t.device;this._customizeInputValue="object"==typeof t&&t.logo||"",this._customizeNameInputValue="object"==typeof t&&t.name||"",this._dialogParams={index:e,station:t,deviceId:s},this.shadowRoot?.querySelector("#customize-dialog")?.show()}_getBrandFromDevice(t){const e=Object.values(this.hass.states).find(e=>this.hass.entities[e.entity_id]?.device_id===t&&["e5","e10","diesel"].includes(e.attributes.fuel_type)),s=e?.attributes.brand;return"string"==typeof s&&"none"!==s.toLowerCase()?s:void 0}_renderCustomizeDialog(){return F`
      <ha-dialog
        id="customize-dialog"
        .heading=${wt(this.hass,"component.tankerkoenig-card.editor.customize")}
        @closed=${t=>{"confirm"===t.detail.action?this._confirmCustomize():(this._customizeInputValue="",this._customizeNameInputValue="")}}
      >
        <div>
          <ha-textfield
            .label=${wt(this.hass,"component.tankerkoenig-card.editor.station_name")}
            .value=${this._customizeNameInputValue}
            @input=${t=>this._customizeNameInputValue=t.target.value}
          ></ha-textfield>
          <ha-textfield
            .label=${wt(this.hass,"component.tankerkoenig-card.editor.logo_url")}
            .placeholder=${wt(this.hass,"component.tankerkoenig-card.editor.logo_url_placeholder")}
            .value=${this._customizeInputValue}
            @input=${t=>this._customizeInputValue=t.target.value}
          ></ha-textfield>
        </div>
        <button slot="primaryAction" dialogAction="confirm">
          ${wt(this.hass,"component.tankerkoenig-card.editor.save")}
        </button>
        <button slot="secondaryAction" dialogAction="cancel">
          ${wt(this.hass,"component.tankerkoenig-card.editor.cancel")}
        </button>
      </ha-dialog>
    `}_confirmCustomize(){const{index:t,deviceId:e,station:s}=this._dialogParams,o=this._customizeInputValue,i=this._customizeNameInputValue;if(void 0!==t&&void 0!==e&&void 0!==s)if(i||o){const s={device:e};i&&(s.name=i),o&&(s.logo=o),this._updateStation(t,s)}else this._updateStation(t,e)}static{this.styles=a`
    ${r(ie)}
  `}};t([pt({attribute:!1})],ae.prototype,"hass",void 0),t([ut()],ae.prototype,"_config",void 0),t([ut()],ae.prototype,"_dialogParams",void 0),t([ut()],ae.prototype,"_customizeInputValue",void 0),t([ut()],ae.prototype,"_customizeNameInputValue",void 0),t([ut()],ae.prototype,"_selectedTab",void 0),t([ut()],ae.prototype,"_activeColorPicker",void 0),t([ut()],ae.prototype,"_addressExpanded",void 0),t([ut()],ae.prototype,"_fontExpanded",void 0),t([ut()],ae.prototype,"_colorExpanded",void 0),ae=t([lt("tankerkoenig-card-editor")],ae);var ce=Object.freeze({__proto__:null,get TankerkoenigCardEditor(){return ae}});export{zt as TankerkoenigCard};
