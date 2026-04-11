function e(e,t,s,i){var o,n=arguments.length,r=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,s,r):o(t,s))||r);return n>3&&r&&Object.defineProperty(t,s,r),r}console.groupCollapsed("%c⛽️ TANKERKOENIG CARD%cv1.6.0","color: orange; font-weight: bold; background: black; padding: 2px 4px; border-radius: 2px 0 0 2px;","color: white; font-weight: bold; background: dimgray; padding: 2px 4px; border-radius: 0 2px 2px 0;"),console.info("A Lovelace card to display German fuel prices from Tankerkönig."),console.info("Github:  https://github.com/timmaurice/lovelace-tankerkoenig-card.git"),console.info("Sponsor: https://buymeacoffee.com/timmaurice"),console.groupEnd(),"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let n=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(t,e))}return e}toString(){return this.cssText}};const r=e=>new n("string"==typeof e?e:e+"",void 0,i),a=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new n(s,e,i)},l=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return r(t)})(e):e,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,_=globalThis,f=_.trustedTypes,m=f?f.emptyScript:"",v=_.reactiveElementPolyfillSupport,b=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},$=(e,t)=>!c(e,t),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&d(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:o}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);o?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...u(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const n=o.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(void 0!==e){const n=this.constructor;if(!1===i&&(o=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??$)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,v?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k=globalThis,A=e=>e,S=k.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+P,O=`<${z}>`,D=document,N=()=>D.createComment(""),M=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,I="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,L=/>/g,R=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,V=/"/g,B=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),q=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),J=new WeakMap,G=D.createTreeWalker(D,129);function K(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const X=(e,t)=>{const s=e.length-1,i=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=U;for(let t=0;t<s;t++){const s=e[t];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===U?"!--"===l[1]?r=j:void 0!==l[1]?r=L:void 0!==l[2]?(B.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=o??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?R:'"'===l[3]?V:H):r===V||r===H?r=R:r===j||r===L?r=U:(r=R,o=void 0);const h=r===R&&e[t+1].startsWith("/>")?" ":"";n+=r===U?s+O:c>=0?(i.push(a),s.slice(0,c)+E+s.slice(c)+P+h):s+P+(-2===c?t:h)}return[K(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Y{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[l,c]=X(e,t);if(this.el=Y.createElement(l,s),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=c[n++],s=i.getAttribute(e).split(P),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?se:"?"===r[1]?ie:"@"===r[1]?oe:te}),i.removeAttribute(e)}else e.startsWith(P)&&(a.push({type:6,index:o}),i.removeAttribute(e));if(B.test(i.tagName)){const e=i.textContent.split(P),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],N()),G.nextNode(),a.push({type:2,index:++o});i.append(e[t],N())}}}else if(8===i.nodeType)if(i.data===z)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(P,e+1));)a.push({type:7,index:o}),e+=P.length-1}o++}}static createElement(e,t){const s=D.createElement("template");return s.innerHTML=e,s}}function Z(e,t,s=e,i){if(t===q)return t;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=M(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(t=Z(e,o._$AS(e,t.values),o,i)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??D).importNode(t,!0);G.currentNode=i;let o=G.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new ee(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new ne(o,this,e)),this._$AV.push(t),a=s[++r]}n!==a?.index&&(o=G.nextNode(),n++)}return G.currentNode=D,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class ee{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),M(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Y.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Q(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=J.get(e.strings);return void 0===t&&J.set(e.strings,t=new Y(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const o of e)i===t.length?t.push(s=new ee(this.O(N()),this.O(N()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(e,t=this,s,i){const o=this.strings;let n=!1;if(void 0===o)e=Z(this,e,t,0),n=!M(e)||e!==this._$AH&&e!==q,n&&(this._$AH=e);else{const i=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=Z(this,i[s+r],t,r),a===q&&(a=this._$AH[r]),n||=!M(a)||a!==this._$AH[r],a===W?e=W:e!==W&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends te{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ie extends te{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class oe extends te{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??W)===q)return;const s=this._$AH,i=e===W&&s!==W||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const re=k.litHtmlPolyfillSupport;re?.(Y,ee),(k.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let le=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let o=i._$litPart$;if(void 0===o){const e=s?.renderBefore??null;i._$litPart$=o=new ee(t.insertBefore(N(),e),e,void 0,s??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};le._$litElement$=!0,le.finalized=!0,ae.litElementHydrateSupport?.({LitElement:le});const ce=ae.litElementPolyfillSupport;ce?.({LitElement:le}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},pe=(e=he,t,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const o=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,o,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];t.call(this,s),this.requestUpdate(i,o,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return(t,s)=>"object"==typeof s?pe(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ge(e){return ue({...e,state:!0,attribute:!1})}
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
const _e=1,fe=e=>(...t)=>({_$litDirective$:e,values:t});let me=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ve="important",be=" !"+ve,ye=fe(class extends me{constructor(e){if(super(e),e.type!==_e||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,s)=>{const i=e[s];return null==i?t:t+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(e,[t]){const{style:s}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?s.removeProperty(e):s[e]=null);for(const e in t){const i=t[e];if(null!=i){this.ft.add(e);const t="string"==typeof i&&i.endsWith(be);e.includes("-")||t?s.setProperty(e,t?i.slice(0,-11):i,t?ve:""):s[e]=i}}return q}}),$e=fe(class extends me{constructor(e){if(super(e),e.type!==_e||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const s=e.element.classList;for(const e of this.st)e in t||(s.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(s.add(e),this.st.add(e)):(s.remove(e),this.st.delete(e)))}return q}});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xe={de:{editor:{groups:{core:"Grundeinstellungen",display:"Anzeige",address:"Adresseinstellungen",font:"Schriftarteinstellungen",color:"Farbeinstellungen"},title:"Titel (Optional)",stations:"Tankstellen",show_street:"Straße anzeigen",show_postcode:"Postleitzahl anzeigen",show_city:"Stadt anzeigen",clickable_addresses:"Klickbare Adressen",map_provider:"Navigations-App",map_providers:{google:"Google Maps",apple:"Apple Maps",waze:"Waze"},show_last_updated:"Zeitstempel der letzten Aktualisierung anzeigen",show_price_changes:"Preisänderungen anzeigen",fuel_types:"Reihenfolge der Kraftstoffarten",hide_unavailable_stations:"Nicht verfügbare Tankstellen ausblenden",sort_by:"Tankstellen nach Preis sortieren",show_only_cheapest:"Nur die günstigste(n) Tankstelle(n) anzeigen",show_only_cheapest_count:"Anzahl der günstigsten Tankstellen (Sortierung erforderlich)",show_prices_side_by_side:"Preise nebeneinander anzeigen",font_scale:"Schriftgröße skalieren",price_bg_color:"Preis Hintergrundfarbe",price_font_color:"Preis Schriftfarbe",fuel_type_options:{e5:"Super E5",e10:"Super E10",diesel:"Diesel"},sort_by_options:{none:"Keine"},add_station:"Tankstelle hinzufügen",customize:"Anpassen",remove:"Entfernen",station_name:"Stationsname (Optional)",logo_url:"Logo-URL (Optional)",logo_url_placeholder:"Pfad zu einem benutzerdefinierten Logo",save:"Speichern",cancel:"Abbrechen",tab_select:"Auswählen",tab_customize:"Anpassen",show_address_info:"Adressanzeige",show_address_detail:"Jeder Schalter steuert die Sichtbarkeit eines Teils der Adresse. Wenn keiner ausgewählt ist, wird die Adresse ausgeblendet."},card:{station_not_found:"Tankstelle nicht gefunden: {station}"}},en:{editor:{groups:{core:"Core Configuration",display:"Display",address:"Address Settings",font:"Font Settings",color:"Color Settings"},title:"Title (Optional)",stations:"Station Entities",show_address:"Show Station Address",show_street:"Show Street",show_postcode:"Show Postcode",show_city:"Show City",clickable_addresses:"Clickable Addresses",map_provider:"Navigation App",map_providers:{google:"Google Maps",apple:"Apple Maps",waze:"Waze"},show_last_updated:"Show Last Updated Timestamp",show_price_changes:"Show Price Changes",fuel_types:"Fuel Types Order",hide_unavailable_stations:"Hide Unavailable Stations",sort_by:"Sort Stations by Price",show_only_cheapest:"Show Only Cheapest Station(s)",show_only_cheapest_count:"Number of Cheapest Stations (requires sort)",show_prices_side_by_side:"Show Prices Side-by-Side",font_scale:"Font Scale",price_bg_color:"Price Background Color",price_font_color:"Price Font Color",fuel_type_options:{e5:"Super E5",e10:"Super E10",diesel:"Diesel"},sort_by_options:{none:"None"},add_station:"Add Station",customize:"Customize",remove:"Remove",station_name:"Station Name (Optional)",logo_url:"Logo URL (Optional)",logo_url_placeholder:"Path to a custom logo",save:"Save",cancel:"Cancel",tab_select:"Select",tab_customize:"Customize",show_address_info:"Address Display",show_address_detail:"Each switch controls the visibility of a part of the address. If none are selected, the address will be hidden."},card:{station_not_found:"Station not found: {station}"}}};function we(e,t){let s=xe[e];for(const e of t){if("object"!=typeof s||null===s)return;s=s[e]}return"string"==typeof s?s:void 0}function ke(e,t,s={}){const i=e.language||"en",o=t.replace("component.tankerkoenig-card.","").split("."),n=we(i,o)??we("en",o);if("string"==typeof n){let e=n;for(const t in s)e=e.replace(`{${t}}`,String(s[t]));return e}return t}const Ae=(e,t,s,i)=>{const o=new CustomEvent(t,{bubbles:!0,cancelable:!1,composed:!0,...i,detail:s});e.dispatchEvent(o)};const Se="https://raw.githubusercontent.com/timmaurice/lovelace-tankerkoenig-card/main/src/gasstation_logos/",Ce=["globus","raiffeisen","svg","orlen"];function Ee(e){if(!e)return`${Se}404.png`;let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");const s=Ce.find(e=>t.startsWith(e));return s&&(t=s),`${Se}${t}.png`}const Pe=a`﻿:host ::slotted(.card-content),.card-content{container-name:tankerkoenig-card;container-type:inline-size;display:flex;flex-direction:column;gap:12px;padding:16px}.warning{color:var(--error-color)}.station{align-items:center;display:flex;gap:12px}.station.closed{filter:grayscale(1);opacity:.5}.logo-container{flex-shrink:0;line-height:0}.logo-container .logo{height:40px;object-fit:contain;width:40px}.info{flex-grow:1;min-width:0}.row-1{overflow:hidden}.station-name{box-sizing:border-box;display:block;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.station-name:hover{animation:marquee 5s linear infinite;overflow:visible;width:fit-content}.address-link{color:inherit;text-decoration:underline;text-decoration-color:var(--divider-color);text-underline-offset:2px}@keyframes marquee{0%{transform:translateX(0)}20%{transform:translateX(0)}100%{transform:translateX(calc(100px - 100%))}}.prices{display:flex;flex-direction:row;gap:8px;justify-content:flex-end;text-align:center;white-space:nowrap}.price-container{background-color:var(--divider-color);border-radius:4px;color:var(--primary-text-color);cursor:pointer;display:flex;flex-direction:column;padding:4px 8px}.price{font-family:"Digital-7","ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;line-height:1;text-shadow:none}.fuel-header{align-items:center;display:flex;justify-content:center}.price sup{font-size:.6em}.currency{font-size:.7em;font-weight:normal;margin-left:2px;opacity:.7}.price-change-indicator{font-size:1em;margin:0 4px;vertical-align:middle}.price-change-indicator.price-up::after{color:var(--error-color);content:"▲"}.price-change-indicator.price-down::after{color:var(--success-color);content:"▼"}@container tankerkoenig-card (max-width: 400px){.prices{flex-direction:column}.price-container{flex-direction:row;justify-content:flex-end}.prices.prices-side-by-side{flex-direction:row}.prices.prices-side-by-side .price-container{flex-direction:column}}`,ze="tankerkoenig-card",Oe=`${ze}-editor`;let De=class extends le{constructor(){super(...arguments),this._priceChanges={},this._stationCache=null,this._watchedEntities=new Set}setConfig(e){if(!e||!e.stations||!Array.isArray(e.stations)||0===e.stations.length)throw new Error("You need to define at least one station entity");this._config=e,this._stationCache=null}static async getConfigElement(){const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});return await t.constructor.getConfigElement(),await Promise.resolve().then(function(){return ct}),document.createElement(Oe)}static getStubConfig(){return{title:"Tankerkönig",stations:[],show_street:!0,show_postcode:!0,show_city:!0}}getCardSize(){return 3}_buildStationCache(e,t){const s={},i=new Set,o={};for(const[t,s]of Object.entries(e.entities))s.device_id&&(t.startsWith("sensor.")||t.startsWith("binary_sensor."))&&(o[s.device_id]||(o[s.device_id]=[]),o[s.device_id].push(t));t.stations.forEach(t=>{const n="string"==typeof t?t:t.device,r=o[n]||[];s[n]||(s[n]={}),"string"!=typeof t&&t.logo&&(s[n].logo=t.logo),"string"!=typeof t&&t.name&&(s[n].name=t.name),r.forEach(t=>{const o=e.states[t];if(!o)return;i.add(t);const r=o.attributes.fuel_type;"e5"===r&&(s[n].e5=t),"e10"===r&&(s[n].e10=t),"diesel"===r&&(s[n].diesel=t),t.endsWith("_status")&&(s[n].status=t)})}),this._stationCache=s,this._watchedEntities=i}shouldUpdate(e){if(e.has("_config"))return this._buildStationCache(this.hass,this._config),!0;const t=e.get("hass");if(t){this._stationCache||this._buildStationCache(this.hass,this._config);let e=!1;for(const s of this._watchedEntities)if(t.states[s]!==this.hass.states[s]){e=!0;break}if(e||t.language!==this.hass.language)return e&&this._fetchPriceChanges(),!0}return!t}_handleMoreInfo(e){Ae(this,"hass-more-info",{entityId:e})}async _fetchPriceChanges(){if(!this._config||!this._config.show_price_changes)return;this._stationCache||this._buildStationCache(this.hass,this._config);const e=this._stationCache||{},t=Object.values(e).flatMap(e=>[e.e5,e.e10,e.diesel]).filter(e=>!!e),s=new Date,i=new Date(s.getTime()-864e5);if(0===t.length)return;const o=await this.hass.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:s.toISOString(),entity_ids:t,minimal_response:!0,no_attributes:!0,significant_changes_only:!1}),n={};for(const e of t){const t=o[e],s=Array.isArray(t)?t.filter(e=>e&&null!==e.s&&"unknown"!==e.s&&!isNaN(parseFloat(e.s))):[];if(s&&s.length>1){const t=s[s.length-1].s,i=s[s.length-2].s,o=parseFloat(t),r=parseFloat(i);isNaN(o)||isNaN(r)||(o>r?n[e]="up":o<r&&(n[e]="down"))}}this._priceChanges=n}render(){if(!this._config||!this.hass)return F``;const e=this._config.fuel_types||["diesel","e10","e5"],t={e5:{label:"E5"},e10:{label:"E10"},diesel:{label:"Diesel"}},s=this._config.sort_by;this._stationCache||this._buildStationCache(this.hass,this._config);let i=Object.entries(this._stationCache||{});if(this._config.hide_unavailable_stations&&(i=i.filter(([,e])=>!e.status||"on"===this.hass.states[e.status].state)),s&&"none"!==s&&i.sort(([,e],[,t])=>{const i=e[s],o=t[s];if(!i)return 1;if(!o)return-1;const n=parseFloat(this.hass.states[i].state),r=parseFloat(this.hass.states[o].state);return isNaN(n)?1:isNaN(r)?-1:n-r}),this._config.show_only_cheapest&&s&&"none"!==s){const e=i.filter(([,e])=>{const t=e[s];return t&&!isNaN(parseFloat(this.hass.states[t].state))});if(e.length>0){const t=this._config.show_only_cheapest_count||1;if(1===t){const t=Math.min(...e.map(([,e])=>parseFloat(this.hass.states[e[s]].state)));i=e.filter(([,e])=>parseFloat(this.hass.states[e[s]].state)===t)}else i=e.slice(0,t)}}return F`
      <ha-card .header=${this._config.title} tabindex="0">
        <div class="card-content">
          ${i.map(([s,i])=>{const o=i.e5||i.e10||i.diesel||i.status;if(!o)return F`
                <div class="warning">
                  ${ke(this.hass,"component.tankerkoenig-card.card.station_not_found",{station:s})}
                </div>
              `;const n=!!i.status&&"on"===this.hass.states[i.status].state,r=this.hass.states[o],a=r.attributes,l=this.hass.devices[s],c=i.name||l?.name_by_user||l?.name||a.station_name||a.friendly_name,d=e=>e?e.toLowerCase().replace(/(?:^|\s|["'([{]|-)+\S/g,e=>e.toUpperCase()):"",h=!1!==this._config.show_street,p=!1!==this._config.show_postcode,u=!1!==this._config.show_city,g=[];if(h){const e=d(a.street||""),t=a.house_number,s=[e,t&&"none"!==t.toLowerCase()?t.trim():""].filter(Boolean).join(" ");s&&g.push(s)}const _=[];p&&_.push(String(a.postcode).padStart(5,"0")),u&&_.push(d(a.city||""));const f=_.filter(Boolean).join(" ");f&&g.push(f);const m=g.join(", ");let v=m;if(this._config.clickable_addresses&&m){const e=[c,m].filter(Boolean).join(", "),t=a.latitude&&a.longitude?`${a.latitude},${a.longitude}`:e;let s=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t)}`;const i=this._config.map_provider||"google";"apple"===i?s=`https://maps.apple.com/?q=${encodeURIComponent(e)}${a.latitude&&a.longitude?`&ll=${a.latitude},${a.longitude}`:""}`:"waze"===i&&(s=a.latitude&&a.longitude?`https://waze.com/ul?ll=${a.latitude},${a.longitude}&navigate=yes`:`https://waze.com/ul?q=${encodeURIComponent(e)}`),v=F`<a href="${s}" target="_blank" rel="noopener noreferrer" class="address-link"
                >${m}</a
              >`}return F`
              <div class="station ${n?"open":"closed"}" tabindex="0">
                <div class="logo-container">
                  ${F`<img
                    class="logo"
                    src=${i.logo||Ee(a.brand)}
                    alt=${a.brand}
                    @error=${e=>e.target.src=Ee()}
                  />`}
                </div>
                <div class="info">
                  <div class="row-1">
                    <span class="station-name">${c}</span>
                  </div>
                  ${m?F`<div class="row-2"><span class="address">${v}</span></div>`:""}
                  ${this._config.show_last_updated?F`<div class="row-3">
                        <span class="last-updated">${function(e,t){const s=new Date(e),i=new Date,o={hour:"numeric",minute:"2-digit"};return s.getDate()===i.getDate()&&s.getMonth()===i.getMonth()&&s.getFullYear()===i.getFullYear()||Object.assign(o,{year:"numeric",month:"short",day:"2-digit"}),"12"===t.locale?.time_format&&(o.hour12=!0),s.toLocaleString(t.language,o)}(r.last_updated,this.hass)}</span>
                      </div>`:""}
                </div>
                <div
                  class="prices ${$e({"prices-side-by-side":this._config.show_prices_side_by_side||!1})}"
                >
                  ${e.map(e=>{const s=i[e];if(!s)return"";const o=this.hass.states[s],n="unavailable"===o.state||isNaN(parseFloat(o.state));let r="-.--",a="-";const l=o.attributes.unit_of_measurement||"";if(!n){const e=o.state.split(".");r=`${e[0]}.${e[1].substring(0,2)}`,a=e[1].substring(2,3)}const c={"background-color":this._config.price_bg_color||"var(--divider-color)",color:this._config.price_font_color||"var(--primary-text-color)"},d=(this._config.font_scale||100)/100,h={"font-size":1.5*d+"em"},p={"font-size":1*d+"em"},u=this._config.show_price_changes&&!n&&this._priceChanges[s]||"";return F`<div
                      class="price-container"
                      style=${ye(c)}
                      @click=${()=>this._handleMoreInfo(s)}
                      tabindex="0"
                    >
                      <div class="fuel-header">
                        <span class="fuel-type" style=${ye(p)}
                          >${t[e].label}</span
                        >
                        <span
                          class="price-change-indicator ${$e({"price-up":"up"===u,"price-down":"down"===u})}"
                        ></span>
                      </div>
                      <span class="price" style=${ye(h)}
                        >${r}<sup>${a}</sup><span class="currency">${l}</span></span
                      >
                    </div>`})}
                </div>
              </div>
            `})}
        </div>
      </ha-card>
    `}firstUpdated(){this._fetchPriceChanges()}static{this.styles=a`
    ${r(Pe)}
  `}};e([ue({attribute:!1})],De.prototype,"hass",void 0),e([
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function(e){return(t,s,i)=>((e,t,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,s),s))(t,s,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}("ha-card")],De.prototype,"_card",void 0),e([ge()],De.prototype,"_config",void 0),e([ge()],De.prototype,"_priceChanges",void 0),De=e([de(ze)],De),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:ze,name:"Tankerkönig Card",description:"A Lovelace card to display German fuel prices from Tankerkönig.",documentationURL:"https://github.com/timmaurice/lovelace-tankerkoenig-card"}));const Ne=(e,t=0,s=1)=>e>s?s:e<t?t:e,Me=(e,t=0,s=Math.pow(10,t))=>Math.round(s*e)/s,Te=({h:e,s:t,v:s,a:i})=>{const o=(200-t)*s/100;return{h:Me(e),s:Me(o>0&&o<200?t*s/100/(o<=100?o:200-o)*100:0),l:Me(o/2),a:Me(i,2)}},Ie=e=>{const{h:t,s:s,l:i}=Te(e);return`hsl(${t}, ${s}%, ${i}%)`},Ue=e=>{const{h:t,s:s,l:i,a:o}=Te(e);return`hsla(${t}, ${s}%, ${i}%, ${o})`},je=({r:e,g:t,b:s,a:i})=>{const o=Math.max(e,t,s),n=o-Math.min(e,t,s),r=n?o===e?(t-s)/n:o===t?2+(s-e)/n:4+(e-t)/n:0;return{h:Me(60*(r<0?r+6:r)),s:Me(o?n/o*100:0),v:Me(o/255*100),a:i}},Le={},Re=e=>{let t=Le[e];return t||(t=document.createElement("template"),t.innerHTML=e,Le[e]=t),t},He=(e,t,s)=>{e.dispatchEvent(new CustomEvent(t,{bubbles:!0,detail:s}))};let Ve=!1;const Be=e=>"touches"in e,Fe=(e,t)=>{const s=Be(t)?t.touches[0]:t,i=e.el.getBoundingClientRect();He(e.el,"move",e.getMove({x:Ne((s.pageX-(i.left+window.pageXOffset))/i.width),y:Ne((s.pageY-(i.top+window.pageYOffset))/i.height)}))};class qe{constructor(e,t,s,i){const o=Re(`<div role="slider" tabindex="0" part="${t}" ${s}><div part="${t}-pointer"></div></div>`);e.appendChild(o.content.cloneNode(!0));const n=e.querySelector(`[part=${t}]`);n.addEventListener("mousedown",this),n.addEventListener("touchstart",this),n.addEventListener("keydown",this),this.el=n,this.xy=i,this.nodes=[n.firstChild,n]}set dragging(e){const t=e?document.addEventListener:document.removeEventListener;t(Ve?"touchmove":"mousemove",this),t(Ve?"touchend":"mouseup",this)}handleEvent(e){switch(e.type){case"mousedown":case"touchstart":if(e.preventDefault(),!(e=>!(Ve&&!Be(e)||(Ve||(Ve=Be(e)),0)))(e)||!Ve&&0!=e.button)return;this.el.focus(),Fe(this,e),this.dragging=!0;break;case"mousemove":case"touchmove":e.preventDefault(),Fe(this,e);break;case"mouseup":case"touchend":this.dragging=!1;break;case"keydown":((e,t)=>{const s=t.keyCode;s>40||e.xy&&s<37||s<33||(t.preventDefault(),He(e.el,"move",e.getMove({x:39===s?.01:37===s?-.01:34===s?.05:33===s?-.05:35===s?1:36===s?-1:0,y:40===s?.01:38===s?-.01:0},!0)))})(this,e)}}style(e){e.forEach((e,t)=>{for(const s in e)this.nodes[t].style.setProperty(s,e[s])})}}class We extends qe{constructor(e){super(e,"hue",'aria-label="Hue" aria-valuemin="0" aria-valuemax="360"',!1)}update({h:e}){this.h=e,this.style([{left:e/360*100+"%",color:Ie({h:e,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuenow",`${Me(e)}`)}getMove(e,t){return{h:t?Ne(this.h+360*e.x,0,360):360*e.x}}}class Je extends qe{constructor(e){super(e,"saturation",'aria-label="Color"',!0)}update(e){this.hsva=e,this.style([{top:100-e.v+"%",left:`${e.s}%`,color:Ie(e)},{"background-color":Ie({h:e.h,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuetext",`Saturation ${Me(e.s)}%, Brightness ${Me(e.v)}%`)}getMove(e,t){return{s:t?Ne(this.hsva.s+100*e.x,0,100):100*e.x,v:t?Ne(this.hsva.v-100*e.y,0,100):Math.round(100-100*e.y)}}}const Ge=Symbol("same"),Ke=Symbol("color"),Xe=Symbol("hsva"),Ye=Symbol("update"),Ze=Symbol("parts"),Qe=Symbol("css"),et=Symbol("sliders");class tt extends HTMLElement{static get observedAttributes(){return["color"]}get[Qe](){return[':host{display:flex;flex-direction:column;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}:host([hidden]){display:none!important}[role=slider]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;outline:0}[role=slider]:last-child{border-radius:0 0 8px 8px}[part$=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;display:flex;place-content:center center;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}[part$=pointer]::after{content:"";width:100%;height:100%;border-radius:inherit;background-color:currentColor}[role=slider]:focus [part$=pointer]{transform:translate(-50%,-50%) scale(1.1)}',"[part=hue]{flex:0 0 24px;background:linear-gradient(to right,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red 100%)}[part=hue-pointer]{top:50%;z-index:2}","[part=saturation]{flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,rgba(255,255,255,0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part=saturation-pointer]{z-index:3}"]}get[et](){return[Je,We]}get color(){return this[Ke]}set color(e){if(!this[Ge](e)){const t=this.colorModel.toHsva(e);this[Ye](t),this[Ke]=e}}constructor(){super();const e=Re(`<style>${this[Qe].join("")}</style>`),t=this.attachShadow({mode:"open"});t.appendChild(e.content.cloneNode(!0)),t.addEventListener("move",this),this[Ze]=this[et].map(e=>new e(t))}connectedCallback(){if(this.hasOwnProperty("color")){const e=this.color;delete this.color,this.color=e}else this.color||(this.color=this.colorModel.defaultColor)}attributeChangedCallback(e,t,s){const i=this.colorModel.fromAttr(s);this[Ge](i)||(this.color=i)}handleEvent(e){const t=this[Xe],s={...t,...e.detail};let i;this[Ye](s),((e,t)=>{if(e===t)return!0;for(const s in e)if(e[s]!==t[s])return!1;return!0})(s,t)||this[Ge](i=this.colorModel.fromHsva(s))||(this[Ke]=i,He(this,"color-changed",{value:i}))}[Ge](e){return this.color&&this.colorModel.equal(e,this.color)}[Ye](e){this[Xe]=e,this[Ze].forEach(t=>t.update(e))}}class st extends qe{constructor(e){super(e,"alpha",'aria-label="Alpha" aria-valuemin="0" aria-valuemax="1"',!1)}update(e){this.hsva=e;const t=Ue({...e,a:0}),s=Ue({...e,a:1}),i=100*e.a;this.style([{left:`${i}%`,color:Ue(e)},{"--gradient":`linear-gradient(90deg, ${t}, ${s}`}]);const o=Me(i);this.el.setAttribute("aria-valuenow",`${o}`),this.el.setAttribute("aria-valuetext",`${o}%`)}getMove(e,t){return{a:t?Ne(this.hsva.a+e.x):e.x}}}class it extends tt{get[Qe](){return[...super[Qe],'[part=alpha]{flex:0 0 24px}[part=alpha]::after{display:block;content:"";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:inherit;background-image:var(--gradient);box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part^=alpha]{background-color:#fff;background-image:url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>\')}[part=alpha-pointer]{top:50%}']}get[et](){return[...super[et],st]}}const ot={defaultColor:"rgba(0, 0, 0, 1)",toHsva:e=>{const t=/rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i.exec(e);return t?je({r:Number(t[1])/(t[2]?100/255:1),g:Number(t[3])/(t[4]?100/255:1),b:Number(t[5])/(t[6]?100/255:1),a:void 0===t[7]?1:Number(t[7])/(t[8]?100:1)}):{h:0,s:0,v:0,a:1}},fromHsva:e=>{const{r:t,g:s,b:i,a:o}=(({h:e,s:t,v:s,a:i})=>{e=e/360*6,t/=100,s/=100;const o=Math.floor(e),n=s*(1-t),r=s*(1-(e-o)*t),a=s*(1-(1-e+o)*t),l=o%6;return{r:Me(255*[s,r,n,n,a,s][l]),g:Me(255*[a,s,s,r,n,n][l]),b:Me(255*[n,n,a,s,s,r][l]),a:Me(i,2)}})(e);return`rgba(${t}, ${s}, ${i}, ${o})`},equal:(e,t)=>e.replace(/\s/g,"")===t.replace(/\s/g,""),fromAttr:e=>e};class nt extends it{get colorModel(){return ot}}const rt=a`.color-input-wrapper{position:relative;flex:1}.color-picker-popup{position:absolute;top:100%;left:0;z-index:10;padding:8px;background-color:var(--card-background-color, white);border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 4px);box-shadow:0px 5px 5px -3px rgba(0,0,0,.2),0px 8px 10px 1px rgba(0,0,0,.14),0px 3px 14px 2px rgba(0,0,0,.12)}.color-picker-popup rgb-string-color-picker{width:200px;height:200px}.color-preview{width:28px;height:28px;border-radius:4px;border:1px solid var(--divider-color);cursor:pointer;box-sizing:border-box}.card-config{display:flex;flex-direction:column;gap:var(--bge-editor-spacing, 12px)}.color-picker-popup{display:none}.color-input-wrapper{align-items:center;display:flex;gap:var(--bge-editor-spacing)}.color-input-wrapper ha-textfield{flex-grow:1;margin-right:calc(var(--bge-editor-spacing, 12px)/2)}.color-preview{border:1px solid var(--divider-color);border-radius:4px;box-sizing:border-box;cursor:pointer;flex-shrink:0;height:28px;width:28px}.group{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 12px);margin-top:0;padding:16px}.group.no-border{border:none;padding:0}.group-header{color:var(--primary-text-color);font-size:16px;font-weight:500;margin-bottom:12px}.row{align-items:center;display:flex;flex-direction:row;gap:16px}.row>*{flex:1 1 50%;min-width:0}ha-formfield{align-items:center;display:flex;justify-content:space-between;padding-bottom:8px}.station-row{align-items:center;display:flex;gap:8px;margin-bottom:8px;transition:opacity .2s ease}.station-row.dragged{opacity:.4}.station-row.drop-above{border-top:2px dashed var(--primary-color)}.station-row.drop-below{border-bottom:2px dashed var(--primary-color)}.station-row .drag-handle{cursor:grab;color:var(--secondary-text-color);display:flex;align-items:center}.station-row .drag-handle:active{cursor:grabbing}.station-row .logo{border-radius:4px;flex-shrink:0;height:32px;object-fit:contain;width:32px}.station-row .station-name{flex-grow:1;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.add-icon{margin-right:8px}.tabs{border-bottom:1px solid var(--divider-color);display:flex}.tab-content{padding-top:16px}.tab{color:var(--secondary-text-color);cursor:pointer;padding:12px 16px;position:relative}.tab.active{border-bottom:2px solid var(--primary-color);color:var(--primary-text-color);margin-bottom:-1px}.search-bar{padding:0 24px}ha-textfield{width:100%}.device-list{margin-top:16px;max-height:400px;overflow-y:auto}ha-dialog{--mdc-dialog-min-width: 400px;--mdc-dialog-max-width: 500px}ha-dialog ha-textfield{display:block;margin-bottom:16px}ha-dialog .dialog-actions{border-top:1px solid var(--divider-color);display:flex;gap:8px;justify-content:flex-end;margin-top:24px;padding-top:16px}ha-dialog .dialog-actions .action-btn{background-color:rgba(0,0,0,0);border:none;border-radius:18px;color:var(--primary-color);cursor:pointer;font-size:14px;font-weight:600;height:36px;padding:0 16px}ha-dialog .dialog-actions .action-btn:hover{background-color:rgba(var(--rgb-primary-color), 0.04)}ha-dialog .dialog-actions .action-btn.primary{background-color:var(--primary-color);color:var(--text-primary-color)}.expansion-content{display:flex;flex-direction:column;gap:16px;padding:16px}ha-expansion-panel{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 12px);margin-top:8px}.font-scale-slider{display:flex;flex-direction:column}`;window.customElements.get("rgba-string-color-picker")||window.customElements.define("rgba-string-color-picker",class extends nt{});const at=[{name:"title",selector:{text:{}}}];window.customElements.get("ha-expansion-panel")||window.customElements.define("ha-expansion-panel",class extends le{static{this.styles=a`
        ha-expansion-panel {
          display: block;
        }
      `}});let lt=class extends le{constructor(){super(...arguments),this._dialogParams={},this._customizeInputValue="",this._customizeNameInputValue="",this._selectedTab=0,this._activeColorPicker=null,this._addressExpanded=!1,this._fontExpanded=!1,this._colorExpanded=!1,this._isCustomizeDialogOpen=!1,this._draggedIndex=null,this._dragOverIndex=null,this._stationsData={stations:[]},this._addressData={show_street:!0,show_postcode:!0,show_city:!0,clickable_addresses:!1,map_provider:"google"},this._handleOutsideClick=e=>{if(!this._activeColorPicker)return;const t=e.composedPath()[0];t.closest(".color-input-wrapper")||t.closest(".color-picker-popup")||this._closeActiveColorPicker()}}setConfig(e){this._config=e;const t=(e.stations||[]).map(e=>"string"==typeof e?e:e.device);JSON.stringify(this._stationsData.stations)!==JSON.stringify(t)&&(this._stationsData={stations:t});const s={show_street:e.show_street??!0,show_postcode:e.show_postcode??!0,show_city:e.show_city??!0,clickable_addresses:e.clickable_addresses??!1,map_provider:e.map_provider??"google"};JSON.stringify(this._addressData)!==JSON.stringify(s)&&(this._addressData=s)}shouldUpdate(e){if(e.has("_config")||e.has("_selectedTab")||e.has("_addressExpanded")||e.has("_fontExpanded")||e.has("_colorExpanded")||e.has("_activeColorPicker")||e.has("_isCustomizeDialogOpen")||e.has("_stationsData")||e.has("_addressData")||e.has("_customizeInputValue")||e.has("_customizeNameInputValue")||e.has("_draggedIndex")||e.has("_dragOverIndex"))return!0;const t=e.get("hass");return!(!t||!this.hass||t.language===this.hass.language)||!t}_valueChanged(e){if(!this.hass||!this._config)return;const t={...e.detail.value};if(void 0!==e.detail.value.stations){const s=e.detail.value.stations||[];t.stations=s.map(e=>(this._config.stations||[]).find(t=>("string"==typeof t?t:t.device)===e)||e)}const s={...this._config,...t};JSON.stringify(this._config)!==JSON.stringify(s)&&Ae(this,"config-changed",{config:s})}_updateStation(e,t){if(!this._config)return;const s=[...this._config.stations||[]];s[e]=t;const i={...this._config,stations:s};Ae(this,"config-changed",{config:i})}_removeStation(e){if(!this._config)return;const t=[...this._config.stations||[]];t.splice(e,1);const s={...this._config,stations:t};Ae(this,"config-changed",{config:s})}connectedCallback(){super.connectedCallback(),document.addEventListener("mousedown",this._handleOutsideClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._handleOutsideClick)}_getStationsSchema(){if(!this.hass)return[];const e=Object.keys(this.hass.entities).filter(e=>"tankerkoenig"===this.hass.entities[e].platform),t=new Set(e.map(e=>this.hass.entities[e].device_id).filter(Boolean)),s=Array.from(t).map(e=>this.hass.devices[e]).filter(Boolean).map(e=>({value:e.id,label:e.name_by_user||e.name||e.id}));return s.sort((e,t)=>e.label.localeCompare(t.label)),[{name:"stations",selector:{select:{multiple:!0,mode:"dropdown",custom_value:!0,options:s}}}]}_closeActiveColorPicker(){if(!this._activeColorPicker)return;const e=this.shadowRoot?.querySelectorAll(".color-picker-popup");e?.forEach(e=>e.style.display="none"),this._activeColorPicker=null}render(){if(!this.hass||!this._config)return F``;let e=[{name:"show_last_updated",selector:{boolean:{}}},{name:"show_price_changes",selector:{boolean:{}}},{name:"hide_unavailable_stations",selector:{boolean:{}}},{name:"fuel_types",selector:{select:{multiple:!0,mode:"list",options:[{value:"diesel",label:ke(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.diesel")},{value:"e10",label:ke(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e10")},{value:"e5",label:ke(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e5")}]}}},{name:"sort_by",selector:{select:{mode:"dropdown",options:[{value:"none",label:ke(this.hass,"component.tankerkoenig-card.editor.sort_by_options.none")},{value:"diesel",label:ke(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.diesel")},{value:"e10",label:ke(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e10")},{value:"e5",label:ke(this.hass,"component.tankerkoenig-card.editor.fuel_type_options.e5")}]}}},{name:"show_only_cheapest",selector:{boolean:{}}},{name:"show_only_cheapest_count",selector:{number:{min:1,mode:"box"}}},{name:"show_prices_side_by_side",selector:{boolean:{}}}];return this._config.sort_by&&"none"!==this._config.sort_by?this._config.show_only_cheapest||(e=e.filter(e=>"show_only_cheapest_count"!==e.name)):e=e.filter(e=>"show_only_cheapest"!==e.name&&"show_only_cheapest_count"!==e.name),F`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${ke(this.hass,"component.tankerkoenig-card.editor.groups.core")}</div>
            <ha-form
              .schema=${at}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${e=>ke(this.hass,`component.tankerkoenig-card.editor.${e.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
          </div>

          <div class="group">
            <div class="group-header">${ke(this.hass,"component.tankerkoenig-card.editor.stations")}</div>
            <!-- Tabs -->
            <div class="tabs">
              <div class="tab ${0===this._selectedTab?"active":""}" @click=${()=>this._selectedTab=0}>
                ${ke(this.hass,"component.tankerkoenig-card.editor.tab_select")}
              </div>
              <div class="tab ${1===this._selectedTab?"active":""}" @click=${()=>this._selectedTab=1}>
                ${ke(this.hass,"component.tankerkoenig-card.editor.tab_customize")}
              </div>
            </div>

            <div class="tab-content">
              ${0===this._selectedTab?F` <ha-form
                    .schema=${this._getStationsSchema()}
                    .hass=${this.hass}
                    .data=${this._stationsData}
                    .computeLabel=${e=>ke(this.hass,`component.tankerkoenig-card.editor.${e.name}`)}
                    @value-changed=${this._valueChanged}
                  ></ha-form>`:F` ${(this._config.stations||[]).map((e,t)=>this._renderStation(e,t))} `}
            </div>
          </div>

          <div class="group">
            <div class="group-header">${ke(this.hass,"component.tankerkoenig-card.editor.groups.display")}</div>
            <ha-form
              .schema=${e}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${e=>ke(this.hass,`component.tankerkoenig-card.editor.${e.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
            <ha-expansion-panel
              .header=${ke(this.hass,"component.tankerkoenig-card.editor.groups.address")}
              .expanded=${this._addressExpanded}
              @click=${e=>{e.target.classList.contains("expansion-panel-summary")&&(this._addressExpanded=!this._addressExpanded)}}
            >
              <div class="expansion-content">
                <ha-alert
                  alert-type="info"
                  .title=${ke(this.hass,"component.tankerkoenig-card.editor.show_address_info")}
                >
                  ${ke(this.hass,"component.tankerkoenig-card.editor.show_address_detail")}
                </ha-alert>
                <ha-form
                  .schema=${[{name:"show_street",selector:{boolean:{}}},{name:"show_postcode",selector:{boolean:{}}},{name:"show_city",selector:{boolean:{}}},{name:"clickable_addresses",selector:{boolean:{}}},...this._addressData.clickable_addresses?[{name:"map_provider",selector:{select:{mode:"dropdown",options:[{value:"google",label:ke(this.hass,"component.tankerkoenig-card.editor.map_providers.google")},{value:"apple",label:ke(this.hass,"component.tankerkoenig-card.editor.map_providers.apple")},{value:"waze",label:ke(this.hass,"component.tankerkoenig-card.editor.map_providers.waze")}]}}}]:[]]}
                  .hass=${this.hass}
                  .data=${this._addressData}
                  .computeLabel=${e=>ke(this.hass,`component.tankerkoenig-card.editor.${e.name}`)}
                  @value-changed=${e=>{const t={...e.detail.value};!1===t.clickable_addresses&&this._addressData.clickable_addresses&&(t.map_provider="google"),this._addressData={...this._addressData,...t},this._valueChanged({detail:{value:t}})}}
                ></ha-form>
              </div>
            </ha-expansion-panel>

            <ha-expansion-panel
              .header=${ke(this.hass,"component.tankerkoenig-card.editor.groups.font")}
              .expanded=${this._fontExpanded}
              @click=${e=>{e.target.classList.contains("expansion-panel-summary")&&(this._fontExpanded=!this._fontExpanded)}}
            >
              <div class="expansion-content">
                <div class="row">
                  <div class="font-scale-slider">
                    <label for="font_scale"
                      >${ke(this.hass,"component.tankerkoenig-card.editor.font_scale")}:
                      <span>${this._config.font_scale||100}%</span></label
                    >
                    <ha-slider
                      id="font_scale"
                      min="70"
                      max="120"
                      step="1"
                      .value=${this._config.font_scale||100}
                      @change=${e=>{const t={...this._config,font_scale:parseFloat(e.target.value)};Ae(this,"config-changed",{config:t})}}
                    ></ha-slider>
                  </div>
                </div>
              </div>
            </ha-expansion-panel>
            <ha-expansion-panel
              .header=${ke(this.hass,"component.tankerkoenig-card.editor.groups.color")}
              .expanded=${this._colorExpanded}
              @click=${e=>{e.target.classList.contains("expansion-panel-summary")&&(this._colorExpanded=!this._colorExpanded)}}
            >
              <div class="expansion-content">
                <div class="row">
                  ${this._renderColorPicker("price_bg_color",ke(this.hass,"component.tankerkoenig-card.editor.price_bg_color"),this._config.price_bg_color||"var(--divider-color)")}
                  ${this._renderColorPicker("price_font_color",ke(this.hass,"component.tankerkoenig-card.editor.price_font_color"),this._config.price_font_color||"var(--primary-text-color)")}
                </div>
              </div>
            </ha-expansion-panel>
          </div>
        </div>

        ${this._renderCustomizeDialog()}
      </ha-card>
    `}_renderColorPicker(e,t,s){return F` <div class="color-input-wrapper">
      <ha-textfield
        .label=${t}
        .value=${this._config[e]||""}
        .configValue=${e}
        @input=${t=>{const s={...this._config,[e]:t.target.value};Ae(this,"config-changed",{config:s})}}
      ></ha-textfield>
      <div
        class="color-preview"
        style="background-color: ${s}"
        @click=${t=>this._toggleColorPicker(t,String(e))}
      ></div>
      <div
        class="color-picker-popup"
        data-picker-id=${e}
        @mousedown=${e=>e.stopPropagation()}
      >
        <rgba-string-color-picker
          .color=${s}
          .configValue=${e}
          @color-changed=${t=>{const s={...this._config,[e]:t.detail.value};Ae(this,"config-changed",{config:s})}}
        ></rgba-string-color-picker>
      </div>
    </div>`}_toggleColorPicker(e,t){e.stopPropagation();const s=this.shadowRoot?.querySelector(`.color-picker-popup[data-picker-id="${t}"]`);if(!s)return;const i=this._activeColorPicker===t;this._closeActiveColorPicker(),i||(s.style.display="block",this._activeColorPicker=t)}_handleDragStart(e,t){this._draggedIndex=t,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.toString()))}_handleDragEnd(){this._draggedIndex=null}_handleDragOver(e,t){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),null!==this._draggedIndex&&this._draggedIndex!==t&&(this._dragOverIndex=t)}_handleDragLeave(e,t){this._dragOverIndex===t&&(this._dragOverIndex=null)}_handleDrop(e,t){if(e.preventDefault(),this._dragOverIndex=null,null===this._draggedIndex||this._draggedIndex===t)return;const s=[...this._config.stations||[]],i=s.splice(this._draggedIndex,1)[0];s.splice(t,0,i),this._draggedIndex=null;const o={...this._config,stations:s};Ae(this,"config-changed",{config:o})}_handleDragEnter(){}_renderStation(e,t){const s="string"==typeof e?e:e.device,i="object"==typeof e?e.logo:void 0,o="object"==typeof e?e.name:void 0,n=this.hass.devices[s],r=o||n?.name_by_user||n?.name||`Station ${t+1}`,a=Ee(this._getBrandFromDevice(s)),l=this._dragOverIndex===t&&null!==this._draggedIndex&&this._draggedIndex>t,c=this._dragOverIndex===t&&null!==this._draggedIndex&&this._draggedIndex<t;return F`
      <div
        class="station-row ${this._draggedIndex===t?"dragged":""} ${l?"drop-above":""} ${c?"drop-below":""}"
        draggable="true"
        @dragstart=${e=>this._handleDragStart(e,t)}
        @dragend=${this._handleDragEnd}
        @dragover=${e=>this._handleDragOver(e,t)}
        @dragleave=${e=>this._handleDragLeave(e,t)}
        @dragenter=${this._handleDragEnter}
        @drop=${e=>this._handleDrop(e,t)}
      >
        <div class="drag-handle"><ha-icon icon="mdi:drag"></ha-icon></div>
        <img
          class="logo"
          src=${i||a}
          @error=${e=>e.target.src=Ee()}
        />
        <span class="station-name">${r}</span>
        <ha-icon-button
          .label=${ke(this.hass,"component.tankerkoenig-card.editor.customize")}
          @click=${()=>this._showCustomizeDialog(e,t)}
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          .label=${ke(this.hass,"component.tankerkoenig-card.editor.remove")}
          @click=${()=>this._removeStation(t)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `}_showCustomizeDialog(e,t){const s="string"==typeof e?e:e.device;this._customizeInputValue="object"==typeof e&&e.logo||"",this._customizeNameInputValue="object"==typeof e&&e.name||"",this._dialogParams={index:t,station:e,deviceId:s},this._isCustomizeDialogOpen=!0}_getBrandFromDevice(e){const t=Object.values(this.hass.states).find(t=>this.hass.entities[t.entity_id]?.device_id===e&&["e5","e10","diesel"].includes(t.attributes.fuel_type)),s=t?.attributes.brand;return"string"==typeof s&&"none"!==s.toLowerCase()?s:void 0}_renderCustomizeDialog(){return F`
      <ha-dialog
        id="customize-dialog"
        .open=${this._isCustomizeDialogOpen}
        .heading=${ke(this.hass,"component.tankerkoenig-card.editor.customize")}
        @closed=${e=>{e.stopPropagation(),this._isCustomizeDialogOpen=!1;const t=e.target;"confirm"===e.detail?.action||"confirm"===t?.closingReason?this._confirmCustomize():(this._customizeInputValue="",this._customizeNameInputValue="")}}
      >
        <div>
          <ha-textfield
            .label=${ke(this.hass,"component.tankerkoenig-card.editor.station_name")}
            .value=${this._customizeNameInputValue}
            @input=${e=>this._customizeNameInputValue=e.target.value}
          ></ha-textfield>
          <ha-textfield
            .label=${ke(this.hass,"component.tankerkoenig-card.editor.logo_url")}
            .placeholder=${ke(this.hass,"component.tankerkoenig-card.editor.logo_url_placeholder")}
            .value=${this._customizeInputValue}
            @input=${e=>this._customizeInputValue=e.target.value}
          ></ha-textfield>
        </div>
        <div class="dialog-actions">
          <button
            class="action-btn"
            @click=${()=>{this._isCustomizeDialogOpen=!1,this._customizeInputValue="",this._customizeNameInputValue=""}}
          >
            ${ke(this.hass,"component.tankerkoenig-card.editor.cancel")}
          </button>
          <button
            class="action-btn primary"
            @click=${()=>{this._confirmCustomize(),this._isCustomizeDialogOpen=!1}}
          >
            ${ke(this.hass,"component.tankerkoenig-card.editor.save")}
          </button>
        </div>
      </ha-dialog>
    `}_confirmCustomize(){const{index:e,deviceId:t,station:s}=this._dialogParams,i=this._customizeInputValue,o=this._customizeNameInputValue;if(void 0!==e&&void 0!==t&&void 0!==s)if(o||i){const s={device:t};o&&(s.name=o),i&&(s.logo=i),this._updateStation(e,s)}else this._updateStation(e,t)}static{this.styles=a`
    ${r(rt)}
  `}};e([ue({attribute:!1})],lt.prototype,"hass",void 0),e([ge()],lt.prototype,"_config",void 0),e([ge()],lt.prototype,"_dialogParams",void 0),e([ge()],lt.prototype,"_customizeInputValue",void 0),e([ge()],lt.prototype,"_customizeNameInputValue",void 0),e([ge()],lt.prototype,"_selectedTab",void 0),e([ge()],lt.prototype,"_activeColorPicker",void 0),e([ge()],lt.prototype,"_addressExpanded",void 0),e([ge()],lt.prototype,"_fontExpanded",void 0),e([ge()],lt.prototype,"_colorExpanded",void 0),e([ge()],lt.prototype,"_isCustomizeDialogOpen",void 0),e([ge()],lt.prototype,"_draggedIndex",void 0),e([ge()],lt.prototype,"_dragOverIndex",void 0),e([ge()],lt.prototype,"_stationsData",void 0),e([ge()],lt.prototype,"_addressData",void 0),lt=e([de("tankerkoenig-card-editor")],lt);var ct=Object.freeze({__proto__:null,get TankerkoenigCardEditor(){return lt}});export{De as TankerkoenigCard};
