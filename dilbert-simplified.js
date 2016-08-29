(function() {
  var btns = {
    first: document.getElementById('first'),
    previous: document.getElementById('previous'),
    random: document.getElementById('random'),
    next: document.getElementById('next'),
    newest: document.getElementById('newest'),
    jump: document.getElementById('jump')
  };

  var comicImg = document.getElementById('comic');
  var comicNumber = document.getElementById('comic-number');
  var jumpInput = document.getElementById('comic-number-input');

  var BASE = 'http://www.foo.be/docs-free/dilbert/www.geek.nl/pics/dilbert-arch/dilbert-';
  var FIRST = DateString(20011103);
  var NEWEST = DateString(20100815);

  var currentComicDate;

  function DateString(src) {
    if (!(this instanceof DateString)) return new DateString(src);

    src = ('' + src).split(/[^0-9]/).join('');

    if (src.length !== 8)
      throw new SyntaxError('Invalid source string passed to DateString constructor');

    this.string = src;
  }

  DateString.prototype.getYear = function() {
    return this.string.slice(0, 4);
  };

  DateString.prototype.getMonth = function() {
    return this.string.slice(4, 6);
  };

  DateString.prototype.getDay = function() {
    return this.string.slice(6, 8);
  };

  DateString.prototype.getNextDay = function() {
    // Note: Years, months, and days are one-based for indices.
    // February is assigned conditionally because its length in days varies (due
    //   to leap years).
    var DAYS_IN_EACH_MONTH = [31, +this.getYear() % 4 ? 28 : 29, 31, 30, 31, 30,
      31, 31, 30, 31, 30, 31];
    var MONTHS_IN_YEAR = 12;


    var lastDayInThisMonth = DAYS_IN_EACH_MONTH[+this.getMonth() - 1];

    var thisYear = +this.getYear();
    var thisMonth = +this.getMonth();
    var thisDay = +this.getDay();

    var tmrwDay = thisDay + 1;
    var tmrwMonth = thisMonth;
    var tmrwYear = thisYear;

    if (tmrwDay > lastDayInThisMonth) {
      tmrwDay = 1;
      tmrwMonth++;

      if (tmrwMonth > MONTHS_IN_YEAR) {
        tmrwMonth = 1;
        tmrwYear++;
      }
    }

    return new DateString(lp0(tmrwYear, 4) + lp0(tmrwMonth, 2) +
      lp0(tmrwDay, 2));
  };

  DateString.prototype.getPreviousDay = function() {
    // Note: Years, months, and days are one-based for indices.
    // February is assigned conditionally because its length in days varies (due
    //   to leap years).
    var DAYS_IN_EACH_MONTH = [31, +this.getYear() % 4 ? 28 : 29, 31, 30, 31, 30,
      31, 31, 30, 31, 30, 31];
    var MONTHS_IN_EACH_YEAR = 12;

    var prevMonthInZeroBasedIndex = +this.getMonth() - 2;
    if (prevMonthInZeroBasedIndex < 0)
      prevMonthInZeroBasedIndex += 12;
    var lastDayInPreviousMonth = DAYS_IN_EACH_MONTH[prevMonthInZeroBasedIndex];

    var thisYear = +this.getYear();
    var thisMonth = +this.getMonth();
    var thisDay = +this.getDay();

    var yesterDay = thisDay - 1;
    var yesterMonth = thisMonth;
    var yesterYear = thisYear;

    if (yesterDay < 1) {
      yesterDay = lastDayInPreviousMonth;
      yesterMonth--;

      if (yesterMonth < 1) {
        yesterMonth = MONTHS_IN_EACH_YEAR;
        yesterYear--;
      }
    }

    return new DateString(lp0(yesterYear, 4) + lp0(yesterMonth, 2) +
      lp0(yesterDay, 2));
  };
  
  DateString.prototype.equals = function(otherDateString) {
    return this.string === otherDateString.string;
  };

  try {
    currentComicDate = DateString(localStorage.lastComicDate);
  } catch (e) {
    currentComicDate = FIRST;
  }

  function lp0(src, len) {
    src += '';
    return src.length < len ? '0'.repeat(len - src.length) + src : src;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  function loadComicAccordingToComicDate() {
    comicNumber.innerHTML = currentComicDate.string;
    comicImg.src = BASE + currentComicDate.string + '.gif';
  }

  function nextComic() {
    if (!currentComicDate.equals(NEWEST)) {
      currentComicDate = currentComicDate.getNextDay();
      loadComicAccordingToComicDate();
    }
  }

  function previousComic() {
    if (!currentComicDate.equals(FIRST)) {
      currentComicDate = currentComicDate.getPreviousDay();
      loadComicAccordingToComicDate();
    }
  }

  function firstComic() {
    currentComicDate = FIRST;
    loadComicAccordingToComicDate();
  }

  function newestComic() {
    currentComicDate = NEWEST;
    loadComicAccordingToComicDate();
  }

  function randomComic() {
    var year = randInt(FIRST.getYear() + 1, NEWEST.getYear() - 1);
    var month = randInt(1, 12);
    var DAYS_IN_EACH_MONTH = [31, year % 4 ? 28 : 29, 31, 30, 31, 30,
      31, 31, 30, 31, 30, 31];
    var day = randInt(1, DAYS_IN_EACH_MONTH[month - 1]);

    var str = '' + year + lp0(month, 2) + lp0(day, 2);

    currentComicDate = DateString(str);
    loadComicAccordingToComicDate();
  }
  
  function jumpComic() {
    try {
      currentComicDate = DateString(jumpInput.value);
      loadComicAccordingToComicDate();
    } catch (e) {
      alert('Your date was invalid. It must be in YYYYMMDD form.');
    }
  }
  
  function saveComic() {
    localStorage.lastComicDate = currentDate.string;
  }

  function listen(elem, func) {
    elem.addEventListener('click', func);
    elem.addEventListener('touchend', func);
  }

  listen(btns.first, firstComic);
  listen(btns.previous, previousComic);
  listen(btns.random, randomComic);
  listen(btns.next, nextComic);
  listen(btns.newest, newestComic);
  listen(btns.jump, jumpComic);
  
  document.body.onbeforeunload = saveComic;
  
  loadComicAccordingToComicDate();
})();
