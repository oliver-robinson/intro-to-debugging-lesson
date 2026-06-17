(function(){
  const rounds = [
    {
      code: "ERROR 404 — FILE NOT FOUND",
      title: "The video file couldn't be found.",
      hint: "The exact words in the error message tell you what's missing — read them again slowly.",
      logLine: "Bug 1: File not found \u2192 checked the link",
      choices: [
        { text: "The internet is probably slow today, so I'll restart the computer.", correct: false,
          explain: "Restarting can fix some problems, but the message says the file wasn't found at all \u2014 that's different from a slow connection. Look at the exact words again." },
        { text: "The video might have been moved or renamed \u2014 let's check the link.", correct: true,
          explain: "Exactly \u2014 \u201cfile not found\u201d means the computer looked in the wrong spot. Checking the link is the right move." },
        { text: "The video must be too long for the page to handle.", correct: false,
          explain: "Good guess, but file length doesn't cause a \u201cnot found\u201d error \u2014 that error means nothing was there at all, no matter the size." },
        { text: "My device probably doesn't support video files.", correct: false,
          explain: "That would cause a different kind of error. \u201cNot found\u201d specifically means the file is missing, not that the device can't play it." }
      ]
    },
    {
      code: "ERROR — UNSUPPORTED FORMAT",
      title: "The video isn't in a format this player understands.",
      hint: "Think about how the file itself was saved, not how it looks on your screen.",
      logLine: "Bug 2: Unsupported format \u2192 loaded a compatible version",
      choices: [
        { text: "Turn up the brightness so it's easier to see.", correct: false,
          explain: "Brightness changes how the screen looks, but it has nothing to do with what format the video is saved in." },
        { text: "Just restart the lesson page and hope it works.", correct: false,
          explain: "Restarting sometimes fixes things by accident, but it doesn't explain why this happened \u2014 and this message tells us exactly why." },
        { text: "Load a version of the video saved in a format this player can read.", correct: true,
          explain: "Right \u2014 different video formats are like different languages. The player needs a version saved in a language it actually understands." },
        { text: "Email the teacher and ask for an extension.", correct: false,
          explain: "Creative, but that won't fix the video! Let's solve this one first." }
      ]
    },
    {
      code: "ERROR — CONNECTION TIMED OUT",
      title: "The video started loading but the connection dropped.",
      hint: "This message is about the trip the video took to reach you, not about the file itself.",
      logLine: "Bug 3: Connection timed out \u2192 reconnected and retried",
      choices: [
        { text: "The video file probably moved again.", correct: false,
          explain: "That was the answer last time, but this message is different \u2014 it's not about where the file is, it's about the connection getting there." },
        { text: "Check the internet connection and try loading it again.", correct: true,
          explain: "Yes \u2014 \u201ctimed out\u201d means the connection took too long or dropped partway through. Checking the connection and trying again is exactly right." },
        { text: "The format must be wrong again.", correct: false,
          explain: "Not this time \u2014 a format problem and a dropped connection look different. This message is about the trip the data took, not the file's format." },
        { text: "The teacher must have deleted the lesson.", correct: false,
          explain: "If that were true, you wouldn't even see this message! The lesson is still there \u2014 the connection just needs another try." }
      ]
    }
  ];

  let roundIndex = 0;
  let solvedThisRound = false;

  const playBtn = document.getElementById('playBtn');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const panel = document.getElementById('panel');
  const recap = document.getElementById('recap');
  const liveRegion = document.getElementById('liveRegion');
  const choicesEl = document.getElementById('choices');
  const feedbackEl = document.getElementById('feedback');
  const hintBox = document.getElementById('hintBox');
  const hintText = document.getElementById('hintText');
  const progressLabel = document.getElementById('progressLabel');
  const progressDots = document.querySelectorAll('#progressDots i');
  const errorTitle = document.getElementById('errorTitle');
  const errorClue = document.getElementById('errorClue');
  const caseLog = document.getElementById('caseLog');

  function announce(msg){
    liveRegion.textContent = '';
    setTimeout(() => { liveRegion.textContent = msg; }, 40);
  }

  function showView(id){
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function renderRound(){
    const r = rounds[roundIndex];
    solvedThisRound = false;

    errorTitle.textContent = r.title;
    errorClue.textContent = r.code;
    showView('viewError');
    announce(r.title + '. ' + r.code);

    progressLabel.textContent = 'Bug ' + (roundIndex + 1) + ' of ' + rounds.length;
    progressDots.forEach((dot, i) => {
      dot.className = i < roundIndex ? 'done' : (i === roundIndex ? 'current' : '');
    });

    hintBox.open = false;
    hintText.textContent = r.hint;

    feedbackEl.className = 'feedback';
    feedbackEl.textContent = '';

    tryAgainBtn.disabled = true;

    choicesEl.innerHTML = '';
    r.choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.innerHTML = '<span class="tag sr-only"></span>' + c.text;
      btn.addEventListener('click', () => handleChoice(btn, c));
      choicesEl.appendChild(btn);
    });

    panel.classList.add('active');
  }

  function handleChoice(btn, choice){
    if (solvedThisRound || btn.disabled) return;

    if (choice.correct){
      btn.classList.add('correct');
      btn.disabled = true;
      btn.querySelector('.tag').textContent = '(correct) ';
      // lock all other choices too
      choicesEl.querySelectorAll('.choice').forEach(b => { if (b !== btn) b.disabled = true; });
      feedbackEl.className = 'feedback good show';
      feedbackEl.textContent = choice.explain;
      tryAgainBtn.disabled = false;
      solvedThisRound = true;
      announce('Correct. ' + choice.explain + ' Try loading again is now ready.');
    } else {
      btn.classList.add('ruled-out');
      btn.disabled = true;
      btn.querySelector('.tag').textContent = '(ruled out) ';
      feedbackEl.className = 'feedback bad show';
      feedbackEl.textContent = choice.explain;
      announce('Not quite. ' + choice.explain);
    }
  }

  function attemptLoad(){
    playBtn.disabled = true;
    showView('viewLoading');
    announce('Loading.');
    setTimeout(() => {
      if (roundIndex >= rounds.length){
        showSuccess();
      } else {
        renderRound();
      }
    }, 900);
  }

  function showSuccess(){
    showView('viewSuccess');
    announce('Lesson loaded. All bugs fixed.');
    panel.classList.remove('active');
    caseLog.innerHTML = rounds.map(r => r.logLine).join('<br>');
    recap.classList.add('show');
  }

  playBtn.addEventListener('click', attemptLoad);

  tryAgainBtn.addEventListener('click', () => {
    roundIndex++;
    attemptLoad();
  });

})();
