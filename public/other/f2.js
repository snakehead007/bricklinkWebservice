﻿const { jsPDF } = require("jspdf");
var callAddFont = function () {
this.addFileToVFS('FreeSerif (copy 2)-normal.ttf', font);
this.addFont('FreeSerif (copy 2)-normal.ttf', 'FreeSerif (copy 2)', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])