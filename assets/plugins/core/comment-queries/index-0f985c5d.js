import{d as P}from"../../../index-eb125c8a.js";const b=P({editor:{preload(t){const g=[t.languages.registerInlayHintsProvider("typescript",{async provideInlayHints(e,i,o){if(e.isDisposed())return;const u=await(await t.languages.typescript.getTypeScriptWorker())(e.uri),a=[],c=/^\s*\/\/\s*\^\?$/gm,p=e.getValue();let r;for(;(r=c.exec(p))!==null;){const d=r.index+r[0].length-1,n=e.getPositionAt(d),f=new t.Position(n.lineNumber-1,n.column),h=e.getOffsetAt(f);if(o.isCancellationRequested)return{hints:[],dispose:()=>{}};const l=await u.getQuickInfoAtPosition("file://"+e.uri.path,h);if(!l||!l.displayParts)continue;let s=l.displayParts.map(y=>y.text).join("").replace(/\r?\n\s*/g," ");s.length>120&&(s=s.slice(0,119)+"..."),a.push({kind:0,position:new t.Position(n.lineNumber,n.column+1),label:s,paddingLeft:!0})}return{hints:a,dispose:()=>{}}}}),t.languages.registerCompletionItemProvider("typescript",{triggerCharacters:[" "],async provideCompletionItems(e,i){if(e.getLineContent(i.lineNumber).trim().endsWith("//"))return{suggestions:[{label:"^?",kind:t.languages.CompletionItemKind.Text,insertText:"^?",range:new t.Range(i.lineNumber,i.column,i.lineNumber,i.column)}]}}})];return()=>g.forEach(e=>e.dispose())}}});export{b as _};
