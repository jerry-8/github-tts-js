/* global bootstrap: false */

(() => {
  'use strict'
  
  window.addEventListener('DOMContentLoaded', () => {

  const langSetting = ['English', 'Putonghua', 'Cantonese'];
  const welcomeEng = ['Welcome', 'Welcome to Industrial Center', 'Nice to see you'];
  const welcomeZhCN = ['欢迎您', '欢迎您来到工業中心', '很高兴见到你'];
  const welcomeZhHK = ['Weclome', '歡迎嚟到工業中心', '好開心見到你'];
  
  var port;
  var reader;
  var portOpen = false;	
  var voices = [];
  var serialbuffer = ''
  var language = langSetting[0];

	function loadVoicesWhenAvailable() {
		voices = speechSynthesis.getVoices();
        if (voices.length !== 0) {
			//console.log("start loading voices %d", count);
			console.log(voices);
		} else {
			setTimeout(function () { loadVoicesWhenAvailable(); }, 100);
			//count++;
		}
    }

  loadVoicesWhenAvailable();

  const setAllClassInactive = () => {
	const list = Array.from(document.querySelector('#languageMenu').children);
    list.forEach((li) => {
		li.children[0].classList.remove("active");
	});
  }
  
  Array.from(document.querySelector('#languageMenu').children).forEach((li) => {
	li.addEventListener('click', (ev) => {
		setAllClassInactive();
		const lang = ev.target.innerText;
		langSetting.forEach( (el, index) => {
			if (lang == el) {
				ev.target.classList.add("active");
				language = langSetting[index];
				console.log("click %s", lang);
			}
		});
	});
  });
    
    function speakLine(buffer) {
		var str = String.fromCharCode.apply(null, new Uint8Array(buffer));
		serialbuffer = serialbuffer+str;
		// if \n speak the line
		if (serialbuffer[(serialbuffer.length-1)] == '\n') {
		
		console.log(serialbuffer);

		let text = 'Welcome';
		let voiceIndex = 0;
		if (language == langSetting[0]) {
			text = serialbuffer + welcomeEng[Math.floor(Math.random() * 3)]; // random number 0-2;
			voiceIndex = 9;
		} else if (language == langSetting[1]) {
			text = serialbuffer + welcomeZhCN[Math.floor(Math.random() * 3)];
			voiceIndex = 24;			
		} else if (language == langSetting[2]) {
			text = serialbuffer + welcomeZhHK[Math.floor(Math.random() * 3)];
			voiceIndex = 25;
		}
		
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = voices[voiceIndex]; // Choose a specific voice
		// Speak the text
		speechSynthesis.speak(utterance);

		serialbuffer = '';
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
		var identy = '12345678D\r\r\n';

		let text = 'Welcome';
		let voiceIndex = 0;
		if (language == langSetting[0]) {
			text = "Hello, Welcome to PolyU Industrial Center";
			voiceIndex = 9;
		} else if (language == langSetting[1]) {
			text = "你好,欢迎来到理工大学工业中心";
			voiceIndex = 24;
		} else if (language == langSetting[2]) {
			//text = "你好,歡迎來到理工大學工業中心";
			text = "你好,歡迎嚟到理工大學工業中心";
			voiceIndex = 25;
		}

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = voices[voiceIndex]; // Choose a specific voice

		// Speak the text
		speechSynthesis.speak(utterance);
	});
  
});
})();
