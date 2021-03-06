/*! d1calendar https://github.com/vvvkor/d1calendar */
/* Replacement of standard HTML inputs: date, datetime-local */

//[type="date|datetime-local"](.datetime).calendar[min][max][data-def]
if(typeof module !== "undefined") var d1 = require('d1css');
(function(){
var main = new(function() {

  "use strict";
  
  this.name = 'calendar';
  
  this.opt = {
    cBtn: 'pad c hover',
    dateFormat: 'd', //y=Y-m-d, d=d.m.Y, m=m/d Y
    hashCancel: '#cancel',
    hashNow: '#now',
    icons: ['date', 'now', 'delete'], //[['svg-date', '&darr;'], ['svg-ok', '&bull;'], ['svg-delete', '&times;']],
    idPicker: 'pick-date',
    minWidth: 801,
    qsCalendar: 'input.calendar',
    showModal: 0,
    sizeLimit: 801,
    stepMinutes: 1,
    inPop: 0
  };

  this.win = null;

  this.init = function(opt) {
    var i;
    for(i in opt) this.opt[i] = opt[i];

    if(window.innerWidth < this.opt.minWidth) return;
    this.win = d1.ins('div', '', {id: this.opt.idPicker, className: 'hide'});
    this.win.style.whiteSpace = 'nowrap';
    d1.b('', [this.win], 'click', function(n, e){ e.stopPropagation(); });
    this.toggle(0);
    //document.querySelector('body').appendChild(this.win);
    
    var t = document.querySelectorAll(this.opt.qsCalendar);
    for (var i = 0; i < t.length; i++){
      this.preparePick(t[i]);
      //t[i].addEventListener('focus', this.openDialog.bind(this, t[i], null), false);
      t[i].addEventListener('click', this.openDialog.bind(this, t[i], null), false);
      //t[i].addEventListener('blur', this.validate.bind(this, t[i], 0), false);
      t[i].addEventListener('input', this.validate.bind(this, t[i], 0), false);
    }
    d1.b('', [window], 'keydown', this.key.bind(this)); 
  }
  
  this.toggle = function(on, n){
    if(n){
      var m = n.getAttribute('data-modal');
      if(m!==null) m = parseInt(m, 10);
      else m = this.opt.showModal || (Math.min(window.innerWidth, window.innerHeight) < this.opt.sizeLimit);
      if(on){
        this.win.className = m ? 'dlg hide pad' : 'toggle pad';
        (m ? document.body : n.thePop).appendChild(this.win);
        if(m){
          var s = this.win.style;
          s.left = s.right = s.top = s.bottom = '';
        }
        this.win.vRel = m ? null : n;
      }
    }
    d1.setState(this.win, on);
  }
  
  this.preparePick = function(n){
    n.vTime = (n.type == 'datetime-local' || n.classList.contains('datetime'));
    n.type = 'text';
    n.autocomplete = 'off';
    if(n.value) n.value = this.fmt(this.parse(n.value), 0, n.vTime);
    var pop = d1.ins('div', '', {className:'pop l'}, n, -1); //''
    if(!this.opt.inPop) pop.style.verticalAlign = 'bottom';
    //pop.appendChild(n);
    n.thePop = pop;
    if(this.opt.icons.length>0){
      var ico = [];
      var ic = d1.ins('span', '', {className:'input-tools'}, n, 1);//icons container
      for(var i in this.opt.icons){
        d1.ins('', ' ', {}, ic);
        var ii = ic.appendChild(d1.i(this.opt.icons[i]));
        ii.style.cursor = 'pointer';
        ico.push(ii);
      }
      if(ico[0]) ico[0].addEventListener('click', this.openDialog.bind(this, n, null), false);
      if(ico[1]) ico[1].addEventListener('click', this.closeDialog.bind(this, n, true, null, null), false);
      if(ico[2]) ico[2].addEventListener('click', this.closeDialog.bind(this, n, '', null, null), false);
    }
    if(this.opt.inPop) pop.appendChild(n);
  }
  
  this.switchMonth = function(n, y, m, d, ch, ci, e){
    e.preventDefault();
    if(d>28){
      var days = (new Date(y, m+1, 0)).getDate();//days in month
      d = Math.min(d, days);
    }
    var h = ch ? parseInt(ch.textContent, 10) : 0;
    var i = ci ? parseInt(ci.textContent, 10) : 0;
    this.openDialog(n, new Date(y, m, d, h, i), e);
  }
  
  this.openDialog = function(n, d, e){
    e.stopPropagation();
    //n.parentNode.insertBefore(this.win, n.nextSibling);
    //n.parentNode.appendChild(this.win);
    this.toggle(1, n);
    this.build(n, d || n.value);
  }

  this.closeDialog = function(n, d, h, m, e){
    e.preventDefault();
    e.stopPropagation();
    if(n){
      this.setValue(n, d, h, m);
      n.focus();
    }
    this.toggle(0);
  }
  
  this.setValue = function(n, d, h, m){
    if(d !== null){
      n.value = (d===true) ? this.fmt(0, 0, n.vTime) : d;
      if(!(d===true && n.vTime) && h && m) n.value += ' ' + this.n(h.textContent) + ':' + this.n(m.textContent);
      this.validate(n, 0);
    }
  }
  
  this.n = function(v, l){
    return ('000'+v).substr(-(l || 2));
  }
  
  this.getLimit = function(n, a, t){
    var r = n.getAttribute(a);
    return r ? this.fmt(this.parse(r), 0, t, 'y') : (a == 'max' ? '9999' : '0000');
  }
  
  this.errLimits = function(n){
    var min = this.getLimit(n, 'min', n.vTime);
    var max = this.getLimit(n, 'max', n.vTime);
    var v = this.fmt(this.parse(n.value), 0, n.vTime, 'y');
    return (min && v<min) || (max && v>max) ? min + ' .. ' + max : '';
  }
  
  this.validate = function(n, re){
    n.setCustomValidity((re || n.value=='') ? '' : this.errLimits(n));
    n.checkValidity();
    n.reportValidity();
  }
  
  this.build = function(n, x){
    while(this.win.firstChild) this.win.removeChild(this.win.firstChild);
    if (typeof x === 'string') x = this.parse(x || n.getAttribute('data-def'));
    var min = this.getLimit(n, 'min', 0);
    var max = this.getLimit(n, 'max', 0);
    //time
    var ch = null;
    var ci = null;
    if(n.vTime){
        var p2 = d1.ins('p', '', {className: 'c'});
        var ph = this.btn('#prev-hour', d1.i('prev'), p2);
        var ch = d1.ins('span', this.n(x.getHours()), {className: 'pad'}, p2);
        var nh = this.btn('#next-hour', d1.i('next'), p2);
        d1.ins('span', ':', {className: 'pad'}, p2);
        var pi = this.btn('#prev-min', d1.i('prev'), p2);
        var ci = d1.ins('span', this.n(x.getMinutes()), {className: 'pad'}, p2);
        var ni = this.btn('#next-min', d1.i('next'), p2);
        ph.addEventListener('click', this.setTime.bind(this, n, ch, ci, -1, 'h'), false);
        nh.addEventListener('click', this.setTime.bind(this, n, ch, ci, +1, 'h'), false);
        pi.addEventListener('click', this.setTime.bind(this, n, ch, ci, -this.opt.stepMinutes, 'i'), false);
        ni.addEventListener('click', this.setTime.bind(this, n, ch, ci, +this.opt.stepMinutes, 'i'), false);
    }
   //buttons
    var y = x.getFullYear();
    var m = x.getMonth();
    var d = x.getDate();
    //var my = x.toString().split(/\s+/);
    //my = my[1] + ' ' + my[3];
    var my = this.n(m+1) + '.' + y;
    var p1 = d1.ins('p', '', {className: 'c'}, this.win);
    var now = this.btn(this.opt.hashNow, d1.i('now'), p1);
    var py = this.btn('#prev-year', d1.i('prev2'), p1);
    var pm = this.btn('#prev-month', d1.i('prev'), p1);
    var cur = d1.ins('span', my, {className: 'pad'}, p1);
    var nm = this.btn('#next-month', d1.i('next'), p1);
    var ny = this.btn('#next-year', d1.i('next2'), p1);
    var close = this.btn(this.opt.hashCancel, d1.i('close'), p1);
    d1.ins('hr', '', {}, this.win);
    now.addEventListener('click', this.closeDialog.bind(this, n, true, ch, ci), false);
    close.addEventListener('click', this.closeDialog.bind(this, n, null, null, null), false);
    py.addEventListener('click', this.switchMonth.bind(this, n, y-1, m, d, ch, ci), false);
    ny.addEventListener('click', this.switchMonth.bind(this, n, y+1, m, d, ch, ci), false);
    pm.addEventListener('click', this.switchMonth.bind(this, n, y, m-1, d, ch, ci), false);
    nm.addEventListener('click', this.switchMonth.bind(this, n, y, m+1, d, ch, ci), false);
    //dates
    var days = (new Date(y, m+1, 0)).getDate();//days in month
    var skip = ((new Date(y, m, 1)).getDay() + 6) % 7;//skip weekdays
    var max = Math.ceil((skip + days) / 7) * 7 - skip;
    var c, v, vv, sel, today, off, wd;
    var cd = this.fmt(new Date());
    var xd = this.fmt(x);
    var row;
    for(var i=-skip+1; i<=max; i++){
      wd = ((skip+i-1)%7)+1;
      if(wd == 1) row = d1.ins('div', '', {className:'row'}, this.win);
      if(i<1 || i>days) c = d1.ins('a', '', {className: 'pad c center'}, row);
      else{
        v = this.fmt(x, i);
        vv = this.fmt(x, i, 0, 'y');
        sel = (v == xd);
        today = false;//(v == cd);
        off = (min && vv<min) || (max && vv>max);
        c = d1.ins('a', i, {className: 'pad c center ' + (sel ? 'bg-w ' : '') + (today ? 'bg-y ' : '') + (off ? 'text-n ' : 'hover ') + (wd>5 ? 'text-e ' : '')}, row);
        if(!off){
          c.href = '#' + i;
          c.addEventListener('click', this.closeDialog.bind(this, n, v, ch, ci), false);
        }
      }
    }
    if(n.vTime){
      d1.ins('hr', '', {}, this.win);
      this.win.appendChild(p2);
    }
  }
  
  this.setTime = function(n, ch, ci, step, item, e){
    var max = (item == 'h') ? 24 : 60;
    var m = (item == 'h') ? ch : ci;
    e.preventDefault();
    //var v = (parseInt(n.textContent, 10) + step + max) % max;
    var v = parseInt(m.textContent, 10);
    var x = v % Math.abs(step);
    v += x ? (step>0 ? step-x : -x) : max+step;
    m.textContent = this.n(v % max);
    this.setValue(n, this.fmt(this.parse(n.value)), ch, ci);
  }

  this.parse = function(d){
    if(!d) d = '';
    var mode = d.indexOf('/')!=-1 ? 'm' : (d.indexOf('.')!=-1 ? 'd' : 'y');
    var seq = (mode=='m') ? [2, 0, 1] : (mode=='d' ? [2, 1, 0] : [0, 1, 2]);
    d = d.split(/\D/);
    while(d.length<6) d.push(d.length==2 ? 1 : 0);
    d = new Date(parseInt(d[seq[0]], 10), parseInt(d[seq[1]]-1, 10), parseInt(d[seq[2]], 10), parseInt(d[3], 10), parseInt(d[4], 10), parseInt(d[5], 10));
    if(!d.getFullYear()) d = new Date();
    return d;
  }
  
  this.fmt = function(x, i, t, f){
    if(!x) x = new Date();
    if(i) x = new Date(x.getFullYear(), x.getMonth(), i);
    var d = this.n(x.getDate());
    var m = this.n(x.getMonth()+1);
    var y = x.getFullYear();
    if(!f) f = this.opt.dateFormat;
    return (f=='m' ? m + '/' + d + ' ' + y : (f=='d' ? d + '.' + m + '.' + y : y + '-' + m + '-' + d))
      + (t ? ' '+this.n(x.getHours())+':'+this.n(x.getMinutes()) : '');
  }
  
  this.btn = function(h, s, p){
    return d1.ins('a', s, {href: h, className: this.opt.cBtn}, p);
  }
  
   this.key = function(n, e) {
     if (e.keyCode==27) if (d1.getState(this.win)) this.toggle(0);
  } 

  d1.plug(this);

})();

  if(typeof module !== "undefined") module.exports = main;
  else if(window) d1calendar = main;
})();