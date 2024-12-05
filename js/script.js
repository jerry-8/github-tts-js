/* global bootstrap: false */

(() => {
  'use strict'
  
  window.addEventListener('DOMContentLoaded', () => {

  const langSetting = ['English', 'Putonghua', 'Cantonese'];
  const welcomeEng = ['Welcome', 'Welcome to Industrial Center', 'Nice to see you'];
  const welcomeZhCN = ['欢迎您', '欢迎您来到工業中心', '很高兴见到你'];
  const welcomeZhHK = ['歡迎你', '歡迎嚟到工業中心', '好開心見到你'];
  
  var port;
  var reader;
  var portOpen = false;	
  var voices = [];
  var serialbuffer = ''
  //var language = langSetting[0];
  var languageIndex = 0;
  //var gVoicesMenu = null;
  var gVoiceSelections = null;
  var gVoiceSelectionIndex = [0,0,0];
  var gVoiceSelectionDefault = [9,24,25];
  
	function addVoicetoDropdownMenu(voices) {
		let voiceMenuHtmlStart = '<li><a class="dropdown-item" href="#">'
		let voiceMenuHtmlEnd = '</a></li>'
		let voicesMenu = '';

		voices.forEach((voice,index) => {
			voicesMenu = voicesMenu + voiceMenuHtmlStart + voice.name + voiceMenuHtmlEnd;
		});
		// add voice selection dropdown menu
		document.querySelector('#voiceDropDownMenu1').innerHTML = voicesMenu;
		document.querySelector('#voiceDropDownMenu2').innerHTML = voicesMenu;
		document.querySelector('#voiceDropDownMenu3').innerHTML = voicesMenu;
		// set default voices
		gVoiceSelectionIndex = gVoiceSelectionDefault;
		document.querySelector('#voiceSelect1').value = gVoiceSelections[gVoiceSelectionIndex[0]].name;
		document.querySelector('#voiceSelect2').value = gVoiceSelections[gVoiceSelectionIndex[1]].name;
		document.querySelector('#voiceSelect3').value = gVoiceSelections[gVoiceSelectionIndex[2]].name;
	}
	
	function loadVoicesWhenAvailable() {
		gVoiceSelections = speechSynthesis.getVoices();
        if (gVoiceSelections.length !== 0) {
			//console.log("start loading voices %d", count);
			console.log(gVoiceSelections);
			addVoicetoDropdownMenu(gVoiceSelections);
		} else {
			setTimeout(function () { loadVoicesWhenAvailable(); }, 100);
			//count++;
		}
    }

	document.querySelectorAll('#voiceDropDownMenu1,#voiceDropDownMenu2,#voiceDropDownMenu3').forEach((ev) => {
		ev.addEventListener('click', (ev) => {
		console.log(ev.target.innerHTML);
		let voiceDropdownMenuIndex = ev.target.parentNode.parentNode.id[ev.target.parentNode.parentNode.id.length-1];
		let voiceText = ev.target.innerText;
		document.querySelector('#voiceSelect'+voiceDropdownMenuIndex).value = voiceText;
		
		if (gVoiceSelections != null) {
			gVoiceSelections.forEach((el,index) => {
				if (el.name == voiceText) {
					gVoiceSelectionIndex[voiceDropdownMenuIndex-1] = index;
				}
			});
		}
		});
	});

	function speakTextTest (languageIndex) {
		let txt = 'Welcome';
		let voiceIndex = 0;
		if (languageIndex == 0) {
			txt = "Hello, Welcome to PolyU Industrial Center";
			voiceIndex = gVoiceSelectionDefault[0];
		} else if (languageIndex == 1) {
			txt = "你好,欢迎来到理工大学工业中心";
			voiceIndex = gVoiceSelectionDefault[1];
		} else if (languageIndex == 2) {
			//text = "你好,歡迎來到理工大學工業中心";
			txt = "你好,歡迎嚟到理工大學工業中心";
			voiceIndex = gVoiceSelectionDefault[2];
		}
		
		const utterance = new SpeechSynthesisUtterance(txt);
		utterance.voice = gVoiceSelections[voiceIndex]; // Choose a specific voice

		// Speak the text
		speechSynthesis.speak(utterance);
	}
	
	document.querySelectorAll('#testButton1,#testButton2,#testButton3').forEach((btn) => {
		btn.addEventListener('click', (ev) => {
			let testButtonIndex = ev.target.id[ev.target.id.length-1];
			speakTextTest(testButtonIndex-1);
			});
		});

	const setAllClassInactive = () => {
		const list = Array.from(document.querySelector('#languageMenu').children);
		list.forEach((li) => {
			li.children[0].classList.remove("active");
		});
	}

	document.querySelector('#languageMenu').addEventListener('click', (ev) => {
		setAllClassInactive();
		const lang = ev.target.innerText;
		langSetting.forEach( (el, index) => {
			if (lang == el) {
				ev.target.classList.add("active");
				//language = langSetting[index];
				languageIndex = index;
				console.log("click %s", lang);
			}
		});
	});
	
    function speakLine(buffer) {
		var str = String.fromCharCode.apply(null, new Uint8Array(buffer));
		serialbuffer = serialbuffer+str;
		// if \n speak the line
		if (serialbuffer[(serialbuffer.length-1)] == '\n') {
		
			console.log(serialbuffer);

			// include card number or not
			let speakCardNum = '';
			if (document.querySelector('#cardIdSwitch').checked == true)
			{
				// add space on each two characters
				let buffer = ''
				for (let i = 0; i < serialbuffer.length ; i++) {
					if (i%2 == 0) {
						buffer = buffer + ' ';
					}
					buffer = buffer + serialbuffer[i];
				}
				speakCardNum = buffer;
			}
					
			let txt = 'Welcome';
			let voiceIndex = 0;
			//if (language == langSetting[0]) {
			if (languageIndex == 0) {
				txt = speakCardNum + welcomeEng[Math.floor(Math.random() * 3)]; // random number 0-2;
				voiceIndex = gVoiceSelectionDefault[0];
			//} else if (language == langSetting[1]) {
			} else if (languageIndex == 1) {
				txt = speakCardNum + welcomeZhCN[Math.floor(Math.random() * 3)];
				voiceIndex = gVoiceSelectionDefault[1];			
			//} else if (language == langSetting[2]) {
			} else if (languageIndex == 2) {
				txt = speakCardNum + welcomeZhHK[Math.floor(Math.random() * 3)];
				voiceIndex = gVoiceSelectionDefault[2];
			}
			
			const utterance = new SpeechSynthesisUtterance(txt);
			utterance.voice = gVoiceSelections[voiceIndex]; // Choose a specific voice
			// Speak the text
			speechSynthesis.speak(utterance);

			serialbuffer = '';
			
			console.log(txt);
		}
	}
	
	document.querySelector('#openPortButton').addEventListener('click', (ev) => {
	
		async function serial_open() {
			port = await navigator.serial.requestPort();
			await port.open({ baudRate: 115200 });
			reader = port.readable.getReader();
			//return {port: port, reader: reader};
			portOpen = true;
			
			readSerial(reader);
		}
		
		serial_open();
	});
		
	async function readSerial(reader) {
		// Listen to data coming from the serial device.
		while (true) {
		  const { value, done } = await reader.read();
		  if (done) {
			// Allow the serial port to be closed later.
			reader.releaseLock();
			break;
		  }
		  // value is a string.
		  console.log(value);
		  speakLine(value.buffer);
		}
		await port.close();
	}
  
  	document.querySelector('#speakTestButton').addEventListener('click', (ev) => {
		speakTextTest(languageIndex);
	});
	
	function detectOS() {
	  // if a browser has no support for navigator.userAgentData.platform use platform as fallback
	  const userAgent = navigator.platform.toLowerCase();

		console.log(userAgent);

	  if (userAgent.includes('win')) {
		return 'Windows';
	  } else if (userAgent.includes('android')) {
		return 'Android';
	  } else if (userAgent.includes('mac')) {
		return 'Mac';
	  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
		return 'iOS';
	  } else if (userAgent.includes('linux')) {
		return 'Linux';
	  }
	  return 'Unknown OS';
	}


	loadVoicesWhenAvailable();

	console.log(detectOS());
	
});
})();
