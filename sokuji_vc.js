var langs =
[['日本語',           ['ja-JP']],
 ['English',         ['en-US']],];
for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 0;
showInfo('info_start');
function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}
var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'mic-animate.gif';
  };
  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };
  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };
  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);

    // get rank from final_transcript
    var outputed_txt = interim_span.innerHTML;
    var is_Has_Sokuji_txt = (
      final_transcript.indexOf('即時')!=-1
    || final_transcript.indexOf('そくじ')!=-1
    || final_transcript.indexOf('6時')!=-1
    || final_transcript.indexOf('食事')!=-1
    || final_transcript.indexOf('祝辞')!=-1
    || final_transcript.indexOf('即死')!=-1
    || final_transcript.indexOf('告示')!=-1
    || final_transcript.indexOf('酷似')!=-1
    || final_transcript.indexOf('ろくじ')!=-1 );

    console.log("認識テキスト：", final_transcript);

    if (!is_Has_Sokuji_txt){
      return;
    }
    if (!is_Has_Sokuji_txt){
      final_transcript = '「そくじ(SOKUJI)」と言ってから順位を言ってみてください.';
    }

    {
      // 細かい誤認識の修正
      if (final_transcript.match('6時')) {
        final_transcript = final_transcript.replace('6時', '');
      }
      if (final_transcript.match('GT 2')) {
        final_transcript = final_transcript.replace('GT 2', '10 11 12');
      }
      if (final_transcript.match('10時')) {
        final_transcript = final_transcript.replace('10時', '10 11');
      }

      // 前Xは同時には発生しない
      if (final_transcript.match('前2')) {
        final_transcript = final_transcript.replace('前2', '1 2 ');
      }
      else if (final_transcript.match('前3')) {
        final_transcript = final_transcript.replace('前3', '1 2 3 ');
      }
      else if (final_transcript.match('前4')) {
        final_transcript = final_transcript.replace('前4', '1 2 3 4 ');
      }
      else if (final_transcript.match('前5')) {
        final_transcript = final_transcript.replace('前5', '1 2 3 4 5 ');
      }
      else if (final_transcript.match('前6')) {
        final_transcript = final_transcript.replace('前6', '1 2 3 4 5 6 ');
      }
      // 誤認識系 ------
      else if (final_transcript.match('前に')) {
        final_transcript = final_transcript.replace('前に', '1 2 ');
      }
      else if (final_transcript.match('My House')) {
        // 前3 が My House に.
        final_transcript = final_transcript.replace('My House', '1 2 3 ');
      }
      else if (final_transcript.match('前より')) {
        final_transcript = final_transcript.replace('前より', '1 2 3 4 ');
      }

      // 下Xは同時には発生しない
      // TODO：下Xは基本的には聞き取れない.
      if (final_transcript.match('下2')) {
        final_transcript = final_transcript.replace('下2', '11 12 ');
      }
      else if (final_transcript.match('下3')) {
        final_transcript = final_transcript.replace('下3', '10 11 12 ');
      }
      else if (final_transcript.match('下4')) {
        final_transcript = final_transcript.replace('下4', '9 10 11 12 ');
      }
      else if (final_transcript.match('下5')) {
        final_transcript = final_transcript.replace('下5', '8 9 10 11 12 ');
      }
      else if (final_transcript.match('下6')) {
        final_transcript = final_transcript.replace('下6', '7 8 9 10 11 12 ');
      }
      // 誤認識系 ------
      else if (final_transcript.match('したさ')) {
        final_transcript = final_transcript.replace('したさ', '10 11 12 ');
      }
      else if (final_transcript.match('したよ')) {
        final_transcript = final_transcript.replace('したよ', '9 10 11 12 ');
      }
    }

    if (is_Has_Sokuji_txt){
      var final_ranks = '';
      var ranks_list = ['10', '0', '11', '12', '2', '3', '4', '5', '6', '7', '8', '9', '1'];
      // Discriminate [1, 2] and [12] in advance
      // 12 must be the last number in MK8D, else it is 1 and 2

      // Check 2 ~ 12
      for(let r of ranks_list) {
        if (final_transcript.match(r)) {
          final_transcript = final_transcript.replace(r, '');
          final_ranks += (' ' + r + '位 -');
          console.log("テキスト：", final_transcript);
          console.log("ランク　：", final_ranks);
        }
      }

      // Temporary measures for misrecognition of [10] and [0]
      if (final_ranks.match('0位')) {
          final_ranks.replace( '0位', '10位');
      }
      final_transcript = final_ranks;
    }

    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }

  };
}
function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}
var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}
function createEmail() {
  var n = final_transcript.indexOf('\n');
  if (n < 0 || n >= 80) {
    n = 40 + final_transcript.substring(40).indexOf(' ');
  }
  var subject = encodeURI(final_transcript.substring(0, n));
  var body = encodeURI(final_transcript.substring(n + 1));
  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}
function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copy_button.style.display = 'none';
  copy_info.style.display = 'inline-block';
  showInfo('');
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  showInfo('info_allow');
  showButtons('none');
  start_timestamp = event.timeStamp;
}
function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}
var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
  copy_button.style.display = style;
  email_button.style.display = style;
  copy_info.style.display = 'none';
  email_info.style.display = 'none';
}