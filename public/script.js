var port = ''
if (location.hostname=='localhost') {
	if (location.port!=''&&location.port!='80') {
		port = ':' + location.port
	}
}

// connect to socket.io
var socket = io.connect(location.protocol+'//'+location.hostname+port)

// IE
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0
		return this.indexOf(searchString, position) === position
	}
}

// ask for nickname, send to server and display in the title
var nickname = sessionStorage.nickname
var password = ''
var privkey = localStorage.privkey
var pubkey = localStorage.pubkey
var dest = {}
dest.name = 'all'
var old_dest = ''
var usesecure = false
var disco = false
var cmd = []
cmd.push('')
var lc = 0
var afk = false
var token=''
var translate = [{lang:'fr',image:'Vous avez reçu une image.',join:' a rejoint le tchat.',quit:' a quitté le tchat.',panic:' a paniqué.',fail:'Vous avez été déconnectés.'},{lang:'en',image:'You have received a picture.',join:' joined in.',quit:' left the chat.',panic:' panicked.',fail:'You have been disconnected.'},{lang:'de',image:'Sie haben ein Bild erhalten.',join:' ist dem Chat beigetreten.',quit:' verließ den Chat.',panic:' geriet in Panik.',fail:'Ihre Verbindung wurde getrennt.'},{lang:'es',image:'Usted ha recibido una imagen.',join:' se unió a la charla.',quit:' dejó la conversación.',panic:' entró en pánico.',fail:'Usted ha sido desconectado.'},{lang:'ja',image:'写真を受け取りました。',join:'がチャットに参加しました。',quit:'はチャットを辞めました。',panic:'はパニックになった。',fail:'サーバーから切断されていました。'}]
var ttsVolume = 1

var soundStates = ['off','up','commenting']
/*if (sessionStorage.sound) {
	var index = soundStates.indexOf(sessionStorage.sound)
	if (index!=-1) {
		var volume = soundStates[index]
		setVolumeIcon(volume)
	}
}
TODO: restore selectedVoice as well
*/
var selectedVoice = ''
$('#readAloud_button').hide()

if (!nickname) {
	window.location = '/login'
} else if (sessionStorage.password) {
	password = sessionStorage.password
}
socket.emit('new_client', {nickname:nickname,password:password})
var title=document.title
setNickname()
startAFKChecker()
socket.emit('token')

if (sessionStorage.advanced) {
	usesecure = true
	$('.keyarea').show()
	if (privkey&&pubkey&&privkey.startsWith('-----BEGIN PGP PRIVATE KEY BLOCK-----')&&pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
		$('#key').attr('src','/img/keyok.png')
		socket.emit('pubkey',pubkey)
	}
} else {
	$('.keyarea').hide()
}

var list = []
var toRead = []

var nmsound = new Audio('./audio/new_message.mp3')
var loginsound = new Audio('./audio/signin.mp3')
var logoutsound = new Audio('./audio/signout.mp3')
var ahsound = new Audio('./audio/ah.mp3')
var panicsound = new Audio('./audio/ah.mp3')
var failsound = new Audio('./audio/fail.mp3')

// if server requests a change in the nickname
socket.on('set_nickname', function(new_nickname){
	nickname = new_nickname
	setNickname()
	messageFromServer('your nickname has been changed to <b>' + nickname + '</b> by server.')
	sessionStorage.nickname = nickname
	sessionStorage.password = ''
})

function sayAloud(text) {
	var msg = new SpeechSynthesisUtterance(text)
	if (findVoice(selectedVoice)) {
		msg.voice = findVoice(selectedVoice)
	}
	msg.volume = ttsVolume
	window.speechSynthesis.speak(msg)
}

// insert message in page upon reception
function displayMessage(data) {
	document.title = data.nickname + ': new message!'
	if (data.image) {
		insertImage(data.nickname, data.image, data.time, false)
	} else {
		insertMessage(data.nickname, data.message, data.time, false, data.secured)
	}
	var sound = soundFromIcon()
	if (sound==='up') {
		nmsound.play()
	} else if (sound==='commenting') {
		if ('speechSynthesis' in window) {
			if (data.image) {
				var sayImage = 'image'
				translate.forEach(function(le) {
					if (findVoice(selectedVoice)&&findVoice(selectedVoice).lang.indexOf(le.lang)!=-1) {
						sayImage = le.image
					}
				})
				sayAloud(sayImage)
			} else {
				sayAloud(decodeHTML(data.message))
			}
		} else {
			ahsound.play()
		}
	}
	// read
	if (document.hasFocus()) {
		socket.emit('read',data.nickname)
	} else {
		toRead.push(data.nickname)
	}
}

socket.on('message', function(data) {
	if (privkey&&data.message.startsWith('-----BEGIN PGP MESSAGE-----')) {
		decrypt(data)
	} else {
		displayMessage(data)
	}
})

socket.on('image', function(data) {
	displayMessage(data)
})

// display info when a new client joins
socket.on('new_client', function(nickname) {
	document.title = nickname + ': joined in.'
	messageFromServer(nickname + ' joined in.')
	addToList({nickname: nickname})
	var sound = soundFromIcon()
	if (sound==='up') {
		loginsound.play()
	} else if (sound==='commenting') {
		if ('speechSynthesis' in window) {
			var joinedIn = ' joined in.'
			translate.forEach(function(le) {
				if (findVoice(selectedVoice)&&findVoice(selectedVoice).lang.indexOf(le.lang)!=-1&&le.join) {
					joinedIn = le.join
				}
			})
			sayAloud(nickname + joinedIn)
		} else {
			loginsound.play()
		}
	}
})

// display info when a client lefts
socket.on('client_left', function(nickname) {
	document.title = nickname + ': left the chat.'
	messageFromServer(nickname + ' left the chat.')
	removeFromList(nickname)
	var sound = soundFromIcon()
	if (sound==='up') {
		logoutsound.play()
	} else if (sound==='commenting') {
		if ('speechSynthesis' in window) {
			var leftChat = ' left the chat.'
			translate.forEach(function(le) {
				if (findVoice(selectedVoice)&&findVoice(selectedVoice).lang.indexOf(le.lang)!=-1&&le.quit) {
					leftChat = le.quit
				}
			})
			sayAloud(nickname + leftChat)
		} else {
			logoutsound.play()
		}
	}
	if (nickname==dest.name) {
		selectConnected('all')
	}
})

// list of connected clients
socket.on('list', function(list) {
	setupList(list)
})

// list of connected clients
socket.on('refresh', function() {
	window.location = '/'
})

// receive public key
socket.on('pubkey', function(pubkey) {
	if (pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
		dest.pubkey = pubkey
		$('#send_secured').attr('src','/img/secured.png')
	} else {
		delete dest.pubkey
	}
})

socket.on('new_pubkey', function(data) {
	var key_nickname = data.nickname
	var pubkey = data.pubkey
	
	if (pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
		updateList({nickname: key_nickname, pubkey: pubkey})
		if (key_nickname == dest.name) {
			dest.pubkey = pubkey
			$('#send_secured').attr('src','/img/secured.png')
		}
	} else {
		updateList({nickname: key_nickname})
		if (key_nickname == dest.name) {
			delete dest.pubkey
			$('#send_secured').attr('src','/img/unsecured.png')
		}
	}
})

socket.on('del_pubkey', function(key_nickname) {
	updateList({nickname: key_nickname})
	if (key_nickname == dest.name) {
		delete dest.pubkey
		$('#send_secured').attr('src','/img/unsecured.png')
	}
})

socket.on('pubkey', function(pubkey) {
	if (pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
		dest.pubkey = pubkey
		$('#send_secured').attr('src','/img/secured.png')
	} else {
		delete dest.pubkey
	}
})

socket.on('disconnect', function(){
	disco = true
	messageFromServer('<b>WARNING:</b> lost connexion with server.')
	messageFromServer('try <a href="/">refreshing</a> the page, or wait for server to reconnect.')
	selectConnected('all')
	var sound = soundFromIcon()
	if (sound==='up') {
		failsound.play()
	} else if (sound==='commenting') {
		if ('speechSynthesis' in window) {
			var fail = 'You have been disconnected.'
			translate.forEach(function(le) {
				if (findVoice(selectedVoice)&&findVoice(selectedVoice).lang.indexOf(le.lang)!=-1&&le.fail) {
					fail = le.fail
				}
			})
			sayAloud(fail)
		} else {
			failsound.play()
		}
	}
})

socket.on('connect', function(){
	if (disco) {
		disco = false
		socket.emit('new_client', {nickname:nickname,password:password})
		messageFromServer('reconnected to server.')
		if (sessionStorage.advanced&&privkey&&pubkey&&privkey.startsWith('-----BEGIN PGP PRIVATE KEY BLOCK-----')&&pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
			$('#key').attr('src','/img/keyok.png')
			socket.emit('pubkey',pubkey)
		}
	}
})

socket.on('help_end', function(){
	selectConnected('all')
	$('#help').show()
})

socket.on('help_start',function () {
	selectConnected('talktome')
	$('#help').hide()
})

socket.on('typing',function (typing_nick) {
	if (typeof timeout !== 'undefined') {
		// TODO: if typing_nick = old typing_nick, ...
		clearTimeout(timeout)
	}
	$('#li_'+typing_nick+' .fa-keyboard-o').show()
	timeout = setTimeout(function () {
		$('#li_'+typing_nick+' .fa-keyboard-o').hide()
	},1500)
})

function sendImage(image) {
	// send message to others
	socket.emit('image', {image: image, to: dest.name})
	// empty chat zone, and set focus on it again
	$('#message').val('').focus()
}

function sendMessage(message) {
	// send message to others
	socket.emit('message', {message: message, to: dest.name})
	// read it if wanted
	var checked = $('#checkbox_readAloud').is(':checked')
	var sound = soundFromIcon()
	if (checked && sound==='commenting') {
		readAloud()
	}
	// if command, store
	if (message.startsWith('/')) {
		lc = cmd.length
		cmd.push(message)
	}
	// empty chat zone, and set focus on it again
	$('#message').val('').focus()
}

// submit form, send message and diplay it on the page
function send() {
	var message = $('#message').val()
	var sendImg = $('#checkbox_img').is(':checked')
	if (sendImg) {
		if (message!='') {
			// TODO: check link img
			sendImage(message)
			// display message in our page as well
			var date = new Date()
			var hours = date.getHours()
			if (hours<10) {
				hours = '0'+hours
			}
			var minutes = date.getMinutes()
			if (minutes<10) {
				minutes = '0'+minutes
			}
			time = hours + ':' + minutes
			insertImage(nickname, message, time, true, dest.name)
		} else {
			// TODO: send uploaded image
		}
	} else if (message!='') {
		var secured = false
		if (dest&&dest.pubkey) {
			encrypt(message)
			secured = true
		} else {
			sendMessage(message)
		}
		// display message in our page as well
		var date = new Date()
		var hours = date.getHours()
		if (hours<10) {
			hours = '0'+hours
		}
		var minutes = date.getMinutes()
		if (minutes<10) {
			minutes = '0'+minutes
		}
		time = hours + ':' + minutes
		insertMessage(nickname, message, time, true, secured, dest.name)
	}
}

function pressKey(e) {
	if (e.key=='Enter') {
		send()
	} else if (e.key=='ArrowUp') {
		$('#message').val(cmd[lc]).focus()
		if (lc>0) {
			lc--
		}
	} else if (e.key=='ArrowDown') {
		if (lc<cmd.length) {
			lc++
		}
		$('#message').val(cmd[lc]).focus()
	}
}

function inputChange() {
	if ($('#message').val().startsWith('/')) {
		if (dest.name!='server') {
			old_dest = dest.name
			selectConnected('server')
		}
	} else if (old_dest) {
		selectConnected(old_dest)
		old_dest = ''
	}
	if (!$('#message').val()) {
		$('#checkbox_img').prop("checked", false)
		$('#upload_img').hide()
	} else {
		socket.emit('typing', dest.name)
	}
}

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
}

// add a message in the page
function scrollDown() {
	var n = $(document).height()
	$('html, body').animate({ scrollTop: n }, 50)
}

function insertMessage(nickname, message, time, toself, secured, to) {
	var cl = 'from_server'
	var secimg = '/img/blanksecure.jpg'
	var totag = ''
	var needEscape = false
	if (toself) {
		cl = 'toself'
		if (to&&to!='all') {
			totag = ' <em>(to '+dest.name+')</em>'
			totag += '<span class="to_'+dest.name+'" style="display: none;"> <i style="color: green" class="fa fa-check" aria-hidden="true"></i></span>'
		}
		needEscape = true
	}
	if (secured) {
		secimg = '/img/secure.jpg'
		needEscape = true
	} else if (usesecure) {
		secimg = '/img/unsecure.jpg'
	}
	if (needEscape) {
		message = escapeHtml(message)
	}
	$('#chat_zone').append('<p class="'+cl+'">'+time+' <img src="'+secimg+'" class="keyarea"> <strong>' + nickname + '</strong> ' + message + totag +'</p>').linkify()
	scrollDown()
}

function insertImage(nickname, image, time, toself, to) {
	var cl = 'from_server'
	var secimg = '/img/blanksecure.jpg'
	var totag = ''
	var needEscape = false
	if (toself) {
		cl = 'toself'
		if (to&&to!='all') {
			totag = ' <em>(to '+dest.name+')</em>'
			totag += '<span class="to_'+dest.name+'" style="display: none;"> <i style="color: green" class="fa fa-check" aria-hidden="true"></i></span>'
		}
		needEscape = true
	}
	if (usesecure) {
		secimg = '/img/unsecure.jpg'
	}
	if (needEscape) {
		image = escapeHtml(image)
	}
	$('#chat_zone').append('<p class="'+cl+'">'+time+' <img src="'+secimg+'" class="keyarea"> <strong>' + nickname + '</strong> <a target="_blank" href="'+image+'"><img style="max-width: 75%;vertical-align:middle;" border="1" src="'+image+'"></a> '+totag +'</p>').linkify()
	scrollDown()
}

function messageFromServer(message) {
	$('#chat_zone').append('<p class="from_server"><em>'+message+'</em></p>')
	scrollDown()
}

function setupList(new_list) {
	list = new_list
	displayList()
}

function addToList(listElement) {
	list.push(listElement)
	displayList()
}

function removeFromList(nickname) {
	var index = list.map(function(data) {
		return data.nickname
	}).indexOf(nickname)
	if (index > -1) {
		list.splice(index, 1)
	}
	displayList()
}

function updateList(listElement) {
	var nickname = listElement.nickname
	var pubkey = listElement.pubkey
	var index = list.map(function(data) {
		return data.nickname
	}).indexOf(nickname)
	if (pubkey) {
		list[index].pubkey = pubkey
	} else {
		delete list[index].pubkey
	}
	displayList()
}

function displayList() {
	//res = '<h3>Connected users:</h3>'
	res = ''
	res += '<ul class="w3-ul w3-card-4">'
	list.forEach(function (data) {
		var nickname = data.nickname
		var pubkey = data.pubkey
		res += '<li id="li_'+nickname+'" class="w3-padding-16" onclick="toggleConnected(\''+nickname+'\')">'
		res += '  <i class="fa fa-circle" aria-hidden="true"></i> '
		res += '  <span class="w3-large">'+nickname+'</span> '
		if (pubkey&&pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
			res += '  <i class="fa fa-key keyarea" aria-hidden="true"></i> '
		} else {
			res += '  <i class="fa fa-key keyarea" aria-hidden="true" style="display: none"></i> '
		}
		if (dest&&dest.name==nickname) {
			res += '  <i class="fa fa-arrow-right" aria-hidden="true"></i> '
		} else {
			res += '  <i class="fa fa-arrow-right" aria-hidden="true" style="display: none"></i> '
		}
		res += '  <i class="fa fa-keyboard-o" aria-hidden="true" style="display: none"></i> '
		res += '</li>'
	})
	res += '</ul>'
	$('#connected').html(res)
}

function focus() {
	document.title = nickname + ' - ' + title
	$('#afk').css('color', 'green')
	socket.emit('afk',false)
	toRead.forEach(function (_nickname) {
		socket.emit('read',_nickname)
	})
	toRead = []
}

function setNickname() {
	document.title = nickname + ' - ' + title
	document.querySelector('#nickname').innerHTML = nickname
}

function toggleConnected(nickname) {
	if (dest.name!=nickname) {
		selectConnected(nickname)
	} else {
		selectConnected('all')
	}
}

function selectConnected(nickname) {
	dest = {}
	dest.name = nickname
	$('#dest').html(dest.name)
	$('#connected .fa-arrow-right').hide()
	$('#li_'+nickname+' .fa-arrow-right').show()
	$('#send_secured').attr('src','/img/unsecured.png')
	if (dest.name!='all') {
		socket.emit('get_pubkey',dest.name)
	}
	if (dest.name=='server') {
		$('#send_secured').attr('src','/img/security_warning.png')
	}
}

function clickLogin() {
	socket.disconnect()
	window.location = '/login'
}

function genKey() {
	//var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome')
	$('#gen_error').hide()
	$('#wait_please').show()
	$('#key_modal').show()
	//var pass = prompt('Enter your passphrase.','')
	var pass = password
	var options = {
		userIds: [{ name:nickname, email:nickname+'@example.com' }],
		numBits: 2048
	}
	openpgp.generateKey(options).catch(function(e) {
		$('#wait_please').hide()
		$('#gen_error').show()
	}).then(function (key) {
		privkey = key.privateKeyArmored
		pubkey = key.publicKeyArmored
		localStorage.privkey = privkey
		localStorage.pubkey = pubkey
		if (privkey.startsWith('-----BEGIN PGP PRIVATE KEY BLOCK-----')&&pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
			$('#key').attr('src','/img/keyok.png')
			socket.emit('pubkey',pubkey)
			$('#key_modal').hide()
		} else {
			$('#wait_please').hide()
			$('#gen_error').show()
		}
	})
}

function showkey() {
	if (privkey&&pubkey) {
		alert(privkey)
	} else {
		genKey()
	}
}

function genKeyNode() {
	$('#gen_error').hide()
	$('#wait_please').show()
	$('#key_modal').show()
	$.get('http://localhost:8888/keys/'+nickname, function(data){
		try {
			var keys = JSON.parse(data)
			privkey = keys.privkey
			pubkey = keys.pubkey
			localStorage.privkey = privkey
			localStorage.pubkey = pubkey
			if (privkey.startsWith('-----BEGIN PGP PRIVATE KEY BLOCK-----')&&pubkey.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
				$('#key').attr('src','/img/keyok.png')
				socket.emit('pubkey',pubkey)
				$('#key_modal').hide()
			} else {
				$('#wait_please').hide()
				$('#gen_error').show()
			}
		} catch (e) {
			$('#wait_please').hide()
			$('#gen_error').show()
		}
	}).fail(function() {
		$('#wait_please').hide()
		$('#gen_error').show()
	})
}

function deleteKey() {
	localStorage.clear()
	$('#key').attr('src','/img/keyko.png')
	socket.emit('del_pubkey')
	pubkey = ''
	privkey = ''
}

function encrypt(message) {
	var options = {
		data: message,  // input as String
		publicKeys: openpgp.key.readArmored(dest.pubkey).keys  // for encryption
		//privateKeys: openpgp.key.readArmored(privkey).keys // for signing (optional)
	}

	openpgp.encrypt(options).then(function(ciphertext) {
		var encrypted = ciphertext.data
		sendMessage(encrypted)
	})
}

function decrypt(data) {
	var encrypted = data.message
	options = {
		message: openpgp.message.readArmored(encrypted),  // parse armored message
		//publicKeys: openpgp.key.readArmored(dest.pubkey).keys,  // for verification (optional)
		privateKey: openpgp.key.readArmored(privkey).keys[0] // for decryption
	}

	openpgp.decrypt(options).then(function(plaintext) {
		data.message = plaintext.data
		data.secured = true
		displayMessage(data)
	})
}

// tutorial
function help() {
	socket.emit('help')
}

// send image
function toggleImg() {
	var checked = $('#checkbox_img').is(':checked')
	if (checked && $('#message').val()==='') {
		$('#upload_img').show()
	} else {
		$('#upload_img').hide()
	}
}

function sendImgMobile() {
	$('#checkbox_img').prop('checked', true)
	send()
}

function uploadImage(mobile) {
	var url = 'https://uploader-levg34.herokuapp.com/upload/'+nickname+'?token='+token
	if (mobile) {
		$('#upload_image_modal_iframe').attr('src', url)
		$('#upload_image_modal').show()
		$('#checkbox_img').prop('checked', true)
	} else {
		uploaderWindow = window.open(url, 'Upload image', 'height=500,width=800')
		//uploaderWindow = window.open('http://localhost:9000/upload/'+nickname+'?token='+token, 'Upload image', 'height=500,width=800')
	}
	socket.emit('token')
}

socket.on('token',function(_token) {
	token=_token
})

socket.on('send_url',function(url) {
	try {
		uploaderWindow.close()
	} catch (e) {
		$('#upload_image_modal').hide()
	}
	$('#message').val(url)
	toggleImg()
	send()
})

// AFK
socket.on('afk', function(data){
	var who = data.who
	if (data.afk) {
		$('#li_'+who).addClass('afk')
	} else {
		$('#li_'+who).removeClass('afk')
	}
})

function checkAFK() {
	afk=!document.hasFocus()
	if (afk) {
		$('#afk').css('color', 'orange')
	} else {
		$('#afk').css('color', 'green')
	}
	socket.emit('afk',afk)
}

function startAFKChecker() {
	setInterval(checkAFK,2000)
}

// read
socket.on('read', function(nickname) {
	$('.to_'+nickname).show()
	$('.to_'+nickname+':visible').removeClass(nickname)
})

// mobile
function toggleMobileMenu() {
	if ($('#mobile_menu .w3-dropdown-content').is(':visible')) {
		$('#mobile_menu .w3-dropdown-content').hide()
	} else {
		$('#mobile_menu .w3-dropdown-content').show()
	}
}

// sound
function setVolumeIcon(volume) {
	var volIcon = $('#volume_icon')
	
	switch (soundFromIcon()) {
		case 'up':
			volIcon.removeClass('fa-volume-up')
			break
		case 'off':
			volIcon.removeClass('fa-volume-off')
			break
		case 'commenting':
			volIcon.removeClass('fa-commenting')
			break
	}
	
	switch (volume) {
		case 'up':
			volIcon.addClass('fa-volume-up')
			break
		case 'off':
			volIcon.addClass('fa-volume-off')
			break
		case 'commenting':
			volIcon.addClass('fa-commenting')
			break
	}
}

function soundFromIcon() {
	var volIcon = $('#volume_icon')
	var res = 'off'
	
	soundStates.forEach(function(state) {
		if (volIcon.attr('class').indexOf(state)!=-1) {
			res = state
		}
	})
	
	return res
}

function clickVolume() {
	var sound = soundFromIcon()
	var index = soundStates.indexOf(sound)
	if (index!=-1) {
		sound = soundStates[(index+1)%3]
	}
	setVolumeIcon(sound)
	if ('speechSynthesis' in window && sound==='commenting') {
		loadVoices()
		$('#tts_voice_modal').show()
		$('#readAloud_button').show()
	} else {
		$('#readAloud_button').hide()
	}
	sessionStorage.sound = sound
}

function decodeHTML(text) {
	return $('<textarea/>').html(text).text()
}

function loadVoices() {
	if ('speechSynthesis' in window && $('#select_voices').find('option').length < 2) {
		var allVoices = window.speechSynthesis.getVoices()
		$('#select_voices').find('option').remove()
		$('#select_voices').append('<option value="">Select voice</option>')
		allVoices.forEach(function(voice) {
			$('#select_voices').append('<option value="'+voice.voiceURI+'">'+voice.name+'</option>')
		})
	}
}

$('#select_voices').change(function() {
	selectedVoice = $('#select_voices option:selected').val()
	$('#tts_voice_modal').hide()
})

$('#volume_voice').change(function() {
	ttsVolume = $('#volume_voice').val()/10
})

loadVoices()

function findVoice(voice) {
	var allVoices = window.speechSynthesis.getVoices()
	var index = allVoices.map(function(e) {
		return e.voiceURI
	}).indexOf(voice)
	if (index!==-1) {
		return allVoices[index]
	}
}

function readAloud() {
	var sound = soundFromIcon()
	if (sound==='up') {
		ahsound.play()
	} else if (sound==='commenting') {
		if ('speechSynthesis' in window) {
			sayAloud($('#message').val())
		} else {
			ahsound.play()
			$('#readAloud_button').hide()
		}
	} else {
		$('#readAloud_button').hide()
	}
}

// panic
function panic() {
	socket.emit('panic')
	socket.disconnect()
	location = 'https://google.fr'
}

socket.on('panic', function(nickname) {
	messageFromServer(nickname+' panicked.')
	var sound = soundFromIcon()
	if (sound==='up') {
		panicsound.play()
	} else if (sound==='commenting') {
		if ('speechSynthesis' in window) {
			var panicked = ' panicked.'
			translate.forEach(function(le) {
				if (findVoice(selectedVoice)&&findVoice(selectedVoice).lang.indexOf(le.lang)!=-1&&le.panic) {
					panicked = le.panic
				}
			})
			sayAloud(nickname + panicked)
		} else {
			panicsound.play()
		}
	}
})
