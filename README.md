# d1calendar

Add-on for [d1](https://github.com/vvvkor/d1).  
Replacement of standard HTML inputs: ``date``, ``datetime-local``.  
[Demo & Docs](https://vvvkor.github.io/d1#calendar)

## Features

* Replaces standard HTML ``date`` and ``datetime-local`` inputs with ``text`` input and custom dropdown calendar.
* Optionally keeps standard inputs for small-screen devices (``minWidth`` option).
* Date ``format`` option: ``d.m.Y``, ``Y-m-d``, ``m/d Y``.
* Validates ``min`` and ``max`` dates.
* Default date for empty field in ``data-def`` attribute.
* Customizable icons.

## Install

```
npm install d1calendar
```

## Usage

On page load call:
```
d1calendar.init(options);
```

In your markup, add ``calendar`` class to ``date`` and ``datetime-local`` inputs which should be replaced.

## Options

### cBtn

CSS class of buttons.  
Default: ``"pad hover"``

### dateFormat

Date format, one of following:

* ``"d"`` for ``d.m.Y``
* ``"m"`` for ``m/d Y``
* ``"y"`` for ``Y-m-d``

Default: ``"d"``

### hashCancel

Hash of "close" link.  
Default: ``"#cancel"``

### hashNow

Hash of "now" link.  
Default: ``"#now"``

### icons

Icons to show after input. Array of up to 3 icons, used to:
 
 1. toggle visibility of the date picker.
 2. set current date (and time)
 3. clear input value

Default: ``["date", "now", "delete"]``

### idPicker

``Id`` of the popup date picker element.  
Default: ``"pick-date"``

### minWidth

Minimum window width for which inputs should be replaced.  
Default: ``801``

### qsCalendar

Query selector of inputs to replace.  
Default: ``"input.calendar"``

### stepMinutes

Minutes step for datetime input.  
Default: ``1``

## Browser Support

* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari

## License

[MIT](./LICENSE)
