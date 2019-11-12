

//复制文字到剪贴板
//注：必须在点击事件等用户操作行为中执行才能写入剪贴板


function clipboardCopy (text) {
	// Use the Async Clipboard API when available. Requires a secure browing
	// context (i.e. HTTPS)
	// if (navigator.clipboard) {
	// 	return navigator.clipboard.writeText(text);
	// }

	// ...Otherwise, use document.execCommand() fallback

	// Put the text to copy into a <span>
	var span = document.createElement('span');
	span.textContent = text;
	span.style.webkitUserSelect = 'text';

	// Preserve consecutive spaces and newlines
	span.style.whiteSpace = 'pre';

	// Add the <span> to the page
	document.body.appendChild(span);

	// Make a selection object representing the range of text selected by the user
	var selection = window.getSelection();
	var range = window.document.createRange();
	selection.removeAllRanges();
	range.selectNode(span);
	selection.addRange(range);

	// Copy text to the clipboard
	var success = false;
	try {
		success = window.document.execCommand('copy');
	} catch (err) {
		console.log('error', err);
	}

	// Cleanup
	selection.removeAllRanges();
	window.document.body.removeChild(span);

	// The Async Clipboard API returns a promise that may reject with `undefined`
	// so we match that here for consistency.
	return success
		? Promise.resolve()
		: Promise.reject(); // eslint-disable-line prefer-promise-reject-errors
}

module.exports = clipboardCopy;


//
// function fallbackCopyTextToClipboard(text) {
// 	var textArea = document.createElement("textarea");
// 	textArea.value = text;
// 	document.body.appendChild(textArea);
// 	textArea.focus();
// 	textArea.select();
//
// 	try {
// 		var successful = document.execCommand('copy');
// 		var msg = successful ? 'successful' : 'unsuccessful';
// 		console.log('Fallback: Copying text command was ' + msg);
// 	} catch (err) {
// 		console.error('Fallback: Oops, unable to copy', err);
// 	}
//
// 	document.body.removeChild(textArea);
// }
// function copyTextToClipboard(text) {
// 	if (!navigator.clipboard) {
// 		fallbackCopyTextToClipboard(text);
// 		return;
// 	}
// 	navigator.clipboard.writeText(text).then(function() {
// 		console.log('Async: Copying to clipboard was successful!');
// 	}, function(err) {
// 		console.error('Async: Could not copy text: ', err);
// 	});
// }
//
//
// module.exports = copyTextToClipboard;