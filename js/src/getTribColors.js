
const colors = {
	trib_gray1:"#222",
	trib_grey1:"#222",
	trib_gray2:"#888",
	trib_grey2:"#888",
	trib_gray3:"#aaa",
	trib_grey3:"#aaa",
	trib_gray4:"#e0e0e0",
	trib_grey4:"#e0e0e0",

	trib_blue1:"#12182d",
	trib_blue2:"#004E87",
	trib_blue3:"#7493c1",
	trib_blue4:"#85b4d3",
	trib_blue5:"#cbdded",

	trib_red1:" #8C001A",
	trib_red2:" #C11B17",
	trib_red3:" #DE5454",
	trib_red4:" #eda398",
	trib_red5:" #f7d9d1",

	trib_orange:" #EB964F",

	trib_yellow1:" #f5f50a",
	trib_yellow2:" #ffff62",
	trib_yellow3:" #ffffc4",

	trib_yellow_green:" #D5D94D",
	trib_tan:" #EFE7DB",

	trib_green2:"#3a7f3b",
	trib_green3:"#4da84e",
	trib_green1:"#2e652f",
	trib_green4:"#71be72",
	trib_green5:"#b4ddb5",

	trib_violet:" #7E587E",
	trib_blue_gray:" #97ADBA",

	bears_blue:" #0B162A",
	bears_orange:" #C83803",

	cubs_blue:" #0E3386",
	cubs_red:" #CC3433",

	packers_green:" #2C5E4F",
	packers_gold:" #FFB612"
}


function hexToRGB(hex, alpha) {
	let hex6;
	if (hex.length == 4){
		hex6 = hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2,3) + hex.slice(3,4) + hex.slice(3,4); 	
	} else {
		hex6 = hex;
	}

    var r = parseInt(hex6.slice(1, 3), 16),
        g = parseInt(hex6.slice(3, 5), 16),
        b = parseInt(hex6.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

function getTribColor(colorName, rgba=false){
	// If an opacity is supplied, then the hex color is converted to rgba values.
	// Without a supplied opacity, the variable defaults to false and a simple hex is returned.
	
	// We'll support both dashes and underscores by converting all to underscores
	colorName = colorName.replace(/-/g,'_')

	if (colors[colorName]){
		return rgba ? hexToRGB(colors[colorName], rgba) : colors[colorName];
	}
	// If the color key is not found at all.
	return false;
}


// Example usage:
// getTribColor('trib-blue2') => "#004E87"
// getTribColor('trib-blue2', .5) => "rgba(0, 78, 135, 0.5)"

module.exports = getTribColor;