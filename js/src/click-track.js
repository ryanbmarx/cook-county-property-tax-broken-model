function clickTrack(uniquePhrase){
	if (window.s) {
	  s.linkTrackVars = "server,prop3,prop20,prop28,prop33,prop34,prop57,eVar3,eVar20,eVar21,eVar34,eVar35,eVar36,eVar37,eVar38,eVar39,eVar51";
	  s.linkTrackEvents = "";
	  // s.prop3 = town;
	  // s.eVar3 = town;
	  s.prop57 = uniquePhrase;
	  s.tl(
	    // Since we're not actually tracking a link click, use
	    // true instead of `this`.  This also supresses a
	    // delay
	    true,
	    // linkType
	    // 'o' for custom link
	    'o',
	    // linkName
	    uniquePhrase,
	    // variableOverrides
	    null
	  );
	}
}

module.exports = clickTrack;