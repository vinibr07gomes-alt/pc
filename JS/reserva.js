(function(){
  'use strict';

  var WA = '5511997281316';
  var MAX_PESSOAS = 100;
  var HORARIOS = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00'];
  var MESES = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  var SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];

  var calState = {
    est: {month: 0, year: 0, sel: null},
    tot: {month: 0, year: 0, sel: null}
  };

  var now = new Date();
  calState.est.month = now.getMonth();
  calState.est.year = now.getFullYear();
  calState.tot.month = now.getMonth();
  calState.tot.year = now.getFullYear();

  buildPeopleSelects();
  buildTimeSelects();
  renderCal('est');
  renderCal('tot');
  bindCalendars();
  bindTabs();
  bindConfirmButtons();
  bindBackButton();

  document.addEventListener('click', closeAll);

  function bindBackButton(){
    var backBtn = document.getElementById('backBtn');
    if(!backBtn) return;

    backBtn.addEventListener('click', function(){
      if(window.history.length > 1) window.history.back();
      else window.location.href = 'index.html';
    });
  }

  function buildPeopleSelects(){
    ['est','tot'].forEach(function(p){
      var inner = document.getElementById(p + '-pinner');
      if(!inner) return;

      inner.innerHTML = '';
      for(var i = 0; i <= MAX_PESSOAS; i++){
        var opt = document.createElement('div');
        opt.className = 'sel-opt';
        opt.textContent = pessoaLabel(i);
        opt.setAttribute('data-val', String(i));
        inner.appendChild(opt);
      }

      bindCustomSelect(p, 'p', function(val){
        return pessoaLabel(parseInt(val, 10));
      });
    });
  }

  function buildTimeSelects(){
    ['est','tot'].forEach(function(p){
      var inner = document.getElementById(p + '-hinner');
      if(!inner) return;

      inner.innerHTML = '';
      HORARIOS.forEach(function(h){
        var opt = document.createElement('div');
        opt.className = 'sel-opt';
        opt.textContent = h;
        opt.setAttribute('data-val', h);
        inner.appendChild(opt);
      });

      bindCustomSelect(p, 'h', function(val){
        return val;
      });
    });
  }

  function bindCustomSelect(prefix, field, labelFn){
    var disp = document.getElementById(prefix + '-' + field + 'd');
    var drop = document.getElementById(prefix + '-' + field + 'drop');
    var hidden = document.getElementById(prefix + '-' + field);

    if(!disp || !drop || !hidden) return;

    disp.addEventListener('click', function(e){
      e.stopPropagation();
      var wasOpen = drop.classList.contains('open');
      closeAll();
      if(!wasOpen){
        drop.classList.add('open');
        disp.classList.add('open');
      }
    });

    disp.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        disp.click();
      }
    });

    drop.addEventListener('click', function(e){
      var opt = e.target.closest('.sel-opt');
      if(!opt) return;

      var val = opt.getAttribute('data-val');
      hidden.value = val;
      disp.querySelector('.sel-txt').textContent = labelFn(val);
      disp.classList.add('has-val');

      drop.querySelectorAll('.sel-opt').forEach(function(item){
        item.classList.remove('chosen');
      });
      opt.classList.add('chosen');
      drop.classList.remove('open');
      disp.classList.remove('open');
    });
  }

  function renderCal(p){
    var s = calState[p];
    var cal = document.getElementById(p + '-cal');
    if(!cal) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var nowY = today.getFullYear();
    var nowM = today.getMonth();
    var isFirst = s.year === nowY && s.month === nowM;
    var firstDay = new Date(s.year, s.month, 1).getDay();
    var daysInMonth = new Date(s.year, s.month + 1, 0).getDate();

    var html = '<div class="cal-head">';
    html += '<button class="cal-nav" id="' + p + '-prev"' + (isFirst ? ' disabled' : '') + '>&#8249;</button>';
    html += '<span class="cal-title">' + MESES[s.month] + ' ' + s.year + '</span>';
    html += '<button class="cal-nav" id="' + p + '-next">&#8250;</button>';
    html += '</div>';
    html += '<div class="cal-wdays">';
    SEMANA.forEach(function(day){
      html += '<div class="cal-wd">' + day + '</div>';
    });
    html += '</div><div class="cal-grid">';

    for(var i = 0; i < firstDay; i++){
      html += '<div class="cal-d empty"></div>';
    }

    for(var d = 1; d <= daysInMonth; d++){
      var date = new Date(s.year, s.month, d);
      date.setHours(0, 0, 0, 0);

      var cls = 'cal-d';
      if(date < today){
        cls += ' disabled';
      } else {
        if(date.getTime() === today.getTime()) cls += ' today';
        if(s.sel && s.sel.getTime() === date.getTime()) cls += ' selected';
      }

      var dStr = pad(d) + '/' + pad(s.month + 1) + '/' + s.year;
      html += '<div class="' + cls + '" data-date="' + dStr + '">' + d + '</div>';
    }

    html += '</div>';
    cal.innerHTML = html;

    var prev = document.getElementById(p + '-prev');
    var next = document.getElementById(p + '-next');
    if(prev){
      prev.addEventListener('click', function(e){
        e.stopPropagation();
        navCal(p, -1);
      });
    }
    if(next){
      next.addEventListener('click', function(e){
        e.stopPropagation();
        navCal(p, 1);
      });
    }

    cal.querySelectorAll('.cal-d[data-date]').forEach(function(el){
      if(el.classList.contains('disabled')) return;

      el.addEventListener('click', function(e){
        e.stopPropagation();
        var ds = el.getAttribute('data-date');
        var pts = ds.split('/').map(Number);
        calState[p].sel = new Date(pts[2], pts[1] - 1, pts[0]);
        var hiddenDate = document.getElementById(p + '-d');
        var disp = document.getElementById(p + '-dd');
        if(!hiddenDate || !disp) return;

        hiddenDate.value = ds;
        disp.querySelector('.cal-txt').textContent = ds;
        disp.classList.add('has-val');
        renderCal(p);
        var currentCal = document.getElementById(p + '-cal');
        if(currentCal) currentCal.classList.remove('open');
        disp.classList.remove('open');
      });
    });
  }

  function navCal(p, dir){
    var s = calState[p];
    s.month += dir;

    if(s.month > 11){
      s.month = 0;
      s.year++;
    }
    if(s.month < 0){
      s.month = 11;
      s.year--;
    }

    var current = new Date();
    if(s.year < current.getFullYear() || (s.year === current.getFullYear() && s.month < current.getMonth())){
      s.month = current.getMonth();
      s.year = current.getFullYear();
    }

    renderCal(p);
  }

  function bindCalendars(){
    ['est','tot'].forEach(function(p){
      var disp = document.getElementById(p + '-dd');
      var cal = document.getElementById(p + '-cal');
      if(!disp || !cal) return;

      disp.addEventListener('click', function(e){
        e.stopPropagation();
        var wasOpen = cal.classList.contains('open');
        closeAll();
        if(!wasOpen){
          cal.classList.add('open');
          disp.classList.add('open');
        }
      });

      disp.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          disp.click();
        }
      });
    });
  }

  function closeAll(){
    document.querySelectorAll('.sel-drop').forEach(function(drop){
      drop.classList.remove('open');
    });
    document.querySelectorAll('.sel-display').forEach(function(display){
      display.classList.remove('open');
    });
    document.querySelectorAll('.calendar').forEach(function(cal){
      cal.classList.remove('open');
    });
    document.querySelectorAll('.cal-display').forEach(function(display){
      display.classList.remove('open');
    });
  }

  function bindTabs(){
    var track = document.getElementById('tabTrack');

    document.querySelectorAll('.tab-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var target = btn.getAttribute('data-tab');

        document.querySelectorAll('.tab-btn').forEach(function(tab){
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        if(track){
          if(target === 'tot') track.classList.add('right');
          else track.classList.remove('right');
        }

        document.querySelectorAll('.tab-panel').forEach(function(panel){
          panel.classList.remove('active');
        });

        var panel = document.getElementById('panel-' + target);
        if(panel) panel.classList.add('active');
        closeAll();
      });
    });
  }

  function bindConfirmButtons(){
    document.querySelectorAll('.btn-confirm').forEach(function(btn){
      btn.addEventListener('click', function(){
        var p = btn.getAttribute('data-panel');
        var pessoasInput = document.getElementById(p + '-p');
        var horarioInput = document.getElementById(p + '-h');
        var dataInput = document.getElementById(p + '-d');
        var obsInput = document.getElementById(p + '-obs');

        if(!pessoasInput || !horarioInput || !dataInput || !obsInput) return;

        var pessoasVal = pessoasInput.value;
        var nP = parseInt(pessoasVal, 10);
        var hor = horarioInput.value;
        var dat = dataInput.value;
        var obs = obsInput.value.trim();

        if(pessoasVal === '' || isNaN(nP)){
          showToast('Por favor, informe o numero de pessoas.', true);
          return;
        }
        if(!hor){
          showToast('Por favor, selecione um horario.', true);
          return;
        }
        if(!dat){
          showToast('Por favor, selecione uma data.', true);
          return;
        }

        var tipo = p === 'est' ? 'Estimativa' : 'Numero Total';
        var labelP = p === 'est' ? 'Estimativa de pessoas' : 'Numero total de pessoas';
        var nLabel = pessoaLabel(nP);

        var msg = 'Ola! Gostaria de fazer uma reserva na Pizzaria 3 em 1.\n\n';
        msg += '- *Tipo de reserva:* ' + tipo + '\n';
        msg += '- *' + labelP + ':* ' + nLabel + '\n';
        msg += '- *Horario:* ' + hor + '\n';
        msg += '- *Data:* ' + dat + '\n';
        if(obs) msg += '- *Observacao:* ' + obs + '\n';
        msg += '\nAguardo a confirmacao!';

        var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
        showToast('Abrindo WhatsApp...', false);
        setTimeout(function(){
          window.open(url, '_blank');
        }, 900);
      });
    });
  }

  function showToast(msg, isErr){
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toast-msg');
    if(!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.remove('err', 'show');
    if(isErr) toast.classList.add('err');

    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(function(){
      toast.classList.remove('show');
    }, isErr ? 2800 : 1800);
  }

  function pessoaLabel(n){
    return n + (n === 1 ? ' pessoa' : ' pessoas');
  }

  function pad(n){
    return String(n).padStart(2, '0');
  }
})();
