import Ember from 'ember';
import layout from '../templates/components/touch-spin';

const { Component, computed, run } = Ember;

export default Component.extend({
  layout,
//***************************** API parameters *********************************

                initVal: '', // Applied when no explicit value is set on the input with the value attribute. Empty string means that the value remains empty on initialization.
                    min: 0, // Minimum value.
                    max: 100, // Maximum value.
                   step: 1, // Incremental/decremental step on up/down change.
  forcestepdivisibility: 'round', // How to force the value to be divisible by step value: 'none' | 'round' | 'floor' | 'ceil'
               decimals: 0, // Number of decimal points.
           stepInterval: 100, // Refresh rate of the spinner in milliseconds.
      stepIntervalDelay: 500, // Time in milliseconds before the spinner starts to spin.
        verticalbuttons: false, // Enables the traditional up/down buttons.
                booster: true, // If enabled, the the spinner is continually becoming faster as holding the button.
              boostStep: 10, // Boost at every nth step.
         maxboostedstep: false, // Maximum step when boosted.
             mouseWheel: true, // Enables the mouse wheel to change the value of the input.

//******************************************************************************
  _keyPressed: 'none',
  _isKeyPressed: false, // detects which key is pressed
  _mousePressed: false, // detects if the mouse button is still pressed
  _isRunning: false, // controls the spinning loop

  _getFloat(property){
    return parseFloat(this.get(property));
  },

  _getInt(property){
    return parseInt(this.get(property));
  },

  value:computed('initVal',{
    get(key,value){
      const initVal = this.get('initVal');
      const _initVal = this.get('_initVal');
      if(!_initVal || _initVal !== initVal){
        this.set('_initVal', initVal);
        this.set('value',initVal);
        return initVal;
      }
      return value;
    },
    set(key,value){
      return value;
    }
  }),

  _changeValue(operation){
    const value = this._getFloat('value');
    const decimals = this._getInt('decimals');
    if(!decimals || decimals <= 0){
      this.set('value',this._checkValue(value, operation));
    } else {
      this.set('value',this._checkValue(value, operation).toFixed(decimals));
    }
    this.set('initVal', this.get('value'));
  },

  _checkValue(value, operation){
    const max = this._getFloat('max');
    const min = this._getFloat('min');
    const step = this._getFloat('step');
    const result = value + (step*operation);
    if(result <= max && result >= min){
      return result;
    } else {
      if(value < step){
        return min;
      }
      if(max-value < step){
        return max
      }
      return value;
    }
  },
  _getKeyPressed(value) {
    if(value === 38){
      return 'up';
    }
    if(value === 40){
      return 'down';
    }
    return 'none';
  },

  keyDown(e){
    const keyPressed = this._getKeyPressed(e.which);

    if(keyPressed !== 'none'){
      this.set('_isKeyPressed',true);
      // avoiding the default behaviour of the key
      e.preventDefault();

      // checking if the other key is pressed too
      if(this.get('_keyPressed') !== 'none') {
        this._stopSpinner();
      }
      this.set('_keyPressed', keyPressed);

      // deducing which operation must be performed
      let operation = keyPressed === 'up'? 1 : -1;

      run.later(() => {
        if(this.get('_isKeyPressed')) {
          this._runSpinner(operation);
        } else {
          this._changeValue(operation);
        }
      }, 150);
    }
  },

  keyUp(e){
    const keyPressed = this._getKeyPressed(e.which);

    if(keyPressed !== 'none'){
      if(keyPressed === this.get('_keyPressed')) {
        if(this.get('_isRunning')) {
          this._stopSpinner();
        }
        this.set('_isKeyPressed', false);
        this.set('_keyPressed', 'none');
      }
    }
  },

  _runSpinner(operation){
    const boostStep =  this.get('boostStep');
    let booster = this.get('booster');
    let round = 0;
    let stepInterval = this.get('stepInterval');
    this.set('_isRunning', true);

    run.later(() => {
      this._spinner(operation, booster, boostStep, stepInterval, round);
    }, this.get('stepIntervalDelay'));
  },

  _stopSpinner(){
    this.set('_isRunning', false);
  },

  _spinner(operation, booster, boostStep, stepInterval, round){
    // Set the new value
    this._changeValue(operation);
    // Increase the speed of the spinner
    if(booster){
      round = round + 1;
      if(round === boostStep){
        stepInterval = stepInterval <= 0 ? 0:stepInterval - 10;
        round = 0;
      }
    }

    run.later(() => {
      if(this.get('_isRunning')){
        this._spinner(operation, booster, boostStep, stepInterval, round);
      }
    }, stepInterval);
  },

  actions:{
    onMouseDown(operation){
      this.set('_mousePressed',true);
      // differenciate between a simple click and a continuously pressed click
      // it needs a bit of a time to realize which kind of click is.
      run.later(() => {
        if(this.get('_mousePressed')){
          this._runSpinner(operation);
        } else {
          this._changeValue(operation);
        }
      }, 250);
    },

    onMouseUp(){
      this.set('_mousePressed',false);
      if(this.get('_isRunning')){
        this._stopSpinner();
      }
    },

    onWheel(e){
      if(this.get('mouseWheel')){
        if(e.deltaY > 0) {
          //scroll down
          this._changeValue(-1);
        }else {
           //scroll up
           this._changeValue(1);
        }
      }
    }
  }
});
