//[type="date|datetime-local"](.datetime).calendar[min][max][data-def]
(function(){
var main = new(function() {

  "use strict";
  
  this.opt = {
    cBtn: 'pad hover',
    dateFormat: 'd', //y=Y-m-d, d=d.m.Y, m=m/d Y
    hashCancel: '#cancel',
    hashNow: '#now',
    icons: [['svg-date', '&darr;'], ['svg-ok', '&bull;'], ['svg-delete', '&times;']],
    idPicker: 'pick-date',
    minWidth: 801,
    qsCalendar: 'input.calendar',
    strClose: '&times;',
    strNext: '&rsaquo;',
    strNextYear: '&raquo;',
    strNow: '&bull;',
    strPrev: '&lsaquo;',
    strPrevYear: '&laquo;'
  };

  this.win = null;

  this.init = function(opt) {
    var i;
    for(i in opt) this.opt[i] = opt[i];

    if(window.innerWidth < this.opt.minWidth) return;
    this.win = d1.ins('div', '', {id: this.opt.idPicker, className: 'pad hide toggle js-control'});
    this.win.style.whiteSpace = 'nowrap';
    //this.win.style.display = 'none';
    document.querySelector('body').appendChild(this.win);
    
    var t = document.querySelectorAll(this.opt.qsCalendar);
    for (var i = 0; i < t.length; i++){
      this.preparePick(t[i]);
      //t[i].addEventListener('focus', this.openDialog.bind(this, t[i], null), false);
      t[i].addEventListener('click', this.openDialog.bind(this, t[i], null), false);
      //t[i].addEventListener('blur', this.validate.bind(this, t[i], 0), false);
      t[i].addEventListener('input', this.validate.bind(this, t[i], 0), false);
    }
  }
  
  this.preparePick = function(n){
    n.vTime = (n.type == 'datetime-local' || n.classList.contains('datetime'));
    n.classList.add('unesc');
    n.type = 'text';
    n.autocomplete = 'off';
    var pop = d1.ins('div','',{className:'pop'},n,1);
    pop.appendChild(n);
    var ico = [];
    for(var i in this.opt.icons){
      d1.ins('', ' ', {}, pop);
      var ii = pop.appendChild(d1.svg(this.opt.icons[i][0],'text-n',this.opt.icons[i][1]));
      ii.style.cursor = 'pointer';
      ico.push(ii);
    }
    if(ico[0]) ico[0].addEventListener('click', this.openDialog.bind(this, n, null), false);
    if(ico[1]) ico[1].addEventListener('click', this.closeDialog.bind(this, n, true, null, null), false);
    if(ico[2]) ico[2].addEventListener('click', this.closeDialog.bind(this, n, '', null, null), false);
  }
  
  this.switchMonth = function(n, y, m, d, ch, ci, e){
    var h = ch ? parseInt(ch.textContent, 10) : 0;
    var i = ci ? parseInt(ci.textContent, 10) : 0;
    this.openDialog(n, new Date(y, m, d, h, i), e);
  }
  
  this.openDialog = function(n, d, e){
    e.stopPropagation();
    //n.parentNode.insertBefore(this.win, n.nextSibling);
    n.parentNode.appendChild(this.win);
    //this.win.style.display = 'block';
    this.win.classList.add('js-show');
    this.win.style.top = (n.offsetTop + n.offsetHeight) + 'px';
    this.win.style.left = (n.offsetLeft) + 'px';
    this.build(n, d || n.value);
  }

  this.closeDialog = function(n, d, h, m, e){
    e.preventDefault();
    if(n){
      if(d !== null){
        n.value = (d===true) ? this.fmt(0, 0, n.vTime) : d;
        if(!(d===true && n.vTime) && h && m) n.value += ' ' + this.n(h.textContent) + ':' + this.n(m.textContent);
        this.validate(n, 0);
      }
      n.focus();
    }
    //this.win.style.display = 'none';
    this.win.classList.remove('js-show');
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
    //console.log(re ? '' : this.errLimits(n));
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
        var ph = this.btn('#prev-hour', this.opt.strPrev, p2);
        var ch = d1.ins('span', this.n(x.getHours()), {className: 'pad'}, p2);
        var nh = this.btn('#next-hour', this.opt.strNext, p2);
        d1.ins('span', ':', {className: 'pad'}, p2);
        var pi = this.btn('#prev-min', this.opt.strPrev, p2);
        var ci = d1.ins('span', this.n(x.getMinutes()), {className: 'pad'}, p2);
        var ni = this.btn('#next-min', this.opt.strNext, p2);
        ph.addEventListener('click', this.setTime.bind(this, ch, -1, 24), false);
        nh.addEventListener('click', this.setTime.bind(this, ch, +1, 24), false);
        pi.addEventListener('click', this.setTime.bind(this, ci, -1, 60), false);
        ni.addEventListener('click', this.setTime.bind(this, ci, +1, 60), false);
    }
   //buttons
    var y = x.getFullYear();
    var m = x.getMonth();
    var d = x.getDate();
    //var my = x.toString().split(/\s+/);
    //my = my[1] + ' ' + my[3];
    var my = this.n(m+1) + '.' + y;
    var p1 = d1.ins('p', '', {className: 'c'}, this.win);
    var now = this.btn(this.opt.hashNow, this.opt.strNow, p1);
    var py = this.btn('#prev-year', this.opt.strPrevYear, p1);
    var pm = this.btn('#prev-month', this.opt.strPrev, p1);
    var cur = d1.ins('span', my, {className: 'pad'}, p1);
    var nm = this.btn('#next-month', this.opt.strNext, p1);
    var ny = this.btn('#next-year', this.opt.strNextYear, p1);
    var close = this.btn(this.opt.hashCancel, this.opt.strClose, p1);
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
    var c, v, vv, sel, today, off, wd;
    var cd = this.fmt(new Date());
    var xd = this.fmt(x);
    for(var i=-skip+1; i<=days; i++){
      wd = ((skip+i-1)%7)+1;
      if(i<1) c = d1.ins('a', '', {className: 'pad c'}, this.win);
      else{
        v = this.fmt(x, i);
        vv = this.fmt(x, i, 0, 'y');
        sel = (v == xd);
        today = false;//(v == cd);
        off = (min && vv<min) || (max && vv>max);
        c = d1.ins('a', i, {href: '#' + i, className: 'pad c ' + (sel ? 'bg-w ' : '') + (today ? 'bg-y ' : '') + (off ? 'text-n ' : 'hover ') + (wd>5 ? 'text-e ' : '')}, this.win);
        if(!off) c.addEventListener('click', this.closeDialog.bind(this, n, v, ch, ci), false);
      }
      c.style.minWidth = '3em';
      c.style.padding = '.5em';
      if(wd == 7) d1.ins('br', '', {}, this.win);
    }
    if(n.vTime){
      d1.ins('hr', '', {}, this.win);
      this.win.appendChild(p2);
    }
  }
  
  this.setTime = function(n, step, max){
    var v = (parseInt(n.textContent, 10) + step + max) % max;
    n.textContent = this.n(v);
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
  
})();

  if(typeof module !== "undefined") module.exports = main;
  else if(window) d1calendar = main;
})();