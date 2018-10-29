# d1calendar

Replacement for standard HTML inputs: ``date``, ``datetime-local``.  
[Demo & Docs](http://vadimkor.ru/projects/d1#calendar)

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

In your markup, add ``calendar`` class to ``date`` and ``datetime-local`` inputs which should be replaced.

On page load call:
```
d1dialog.init(options);
```

## Options

### qsCalendar

Query selector of inputs to replace.  
Default: ``"input.calendar"``

### minWidth

Minimum window width for which inputs should be replaced.  
Default: ``801``

### dateFormat

Date format, one of following:

* ``"d"`` for ``d.m.Y``
* ``"m"`` for ``m/d Y``
* ``"y"`` for ``Y-m-d``

Default: ``"d"``

### pickerId

``Id`` of the popup date picker element  
Default: ``"pick-date"``

### btnClass

CSS class of buttons.  
Default: ``"pad hover"``

### hashNow

Hash of "now" link.  
Default: ``"#now"``

### hashCancel

Hash of "close" link.  
Default: ``"#cancel"``

### icons

Icons to show after input. Array of up to 3 icons, used to:
 
 1. toggle visibility of the date picker.
 2. set current date (and time)
 3. clear input value

Each icon is presented as array of 2 elements:
 1. ``id`` of SVG ``symbol`` to use as the icon, or empty string
 2. alternative text to show instead of icon if icon symbol is not set or is not found on page

Default: ``[["svg-date", "&darr;"], ["svg-ok", "&bull;"], ["svg-delete", "&times;"]]``

### strPrev

Label on "previous" button.  
Default: ``"&lsaquo;"``

### strNext

Label on "next" button.  
Default: ``"&rsaquo;"``

### strPrevYear

Label on "previous year" button.  
Default: ``"&laquo;"``

### strNextYear

Label on "next year" button.  
Default: ``"&raquo;"``

### strClose

Label on "close" button.  
Default: ``"&times;"``

### strNow

Label on "now" button.  
Default: ``"&bull;"``


## Browser Support

* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari

## License

[MIT](./LICENSE)
