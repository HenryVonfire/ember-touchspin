# Ember-touchspin

Ember version of [Bootstrap TouchSpin](https://github.com/istvan-ujjmeszaros/bootstrap-touchspin).

## Usage

Ember-touchspin allows you to freely design your TouchSpin component in the way you want by providing a set of yield actions. 

```
{{#touch-spin
  initVal=inputValue
  step=1
  decimals=0
  as |touchSpin|}}
    <button type="button" onmouseup={{action touchSpin.onMouseUpDecrement}} onmousedown={{action touchSpin.onMouseDownDecrement}}>-</button>
    <span>hey</span>
    <input style="display: inline-block;" value={{touchSpin.value}} type="text" onwheel={{action touchSpin.onWheel}} oninput={{action "onChanged" value="target.value"}}>
    <span>%</span>
    <button type="button" onmouseup={{action touchSpin.onMouseUpIncrement}} onmousedown={{action touchSpin.onMouseDownIncrement}}>+</button>
  {{/touch-spin}}
  ```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
