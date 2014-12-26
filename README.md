# rework-matches

An implementation of the `:matches` pseudo-selector for [rework](https://github.com/reworkcss), based on [CSS Selectors Level 4](http://dev.w3.org/csswg/selectors4/#matches).

## Installation

```
npm install rework-matches
```

## Usage

```css
a:matches(:hover, :active, :focus) > :matches(span, div) {
  color: red;
}
```

..becomes..

```css
a:hover > span,
a:hover > div,
a:active > span,
a:active > div,
a:focus > span,
a:focus > div {
  color: red;
}
```
