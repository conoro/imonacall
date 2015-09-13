# I'm On A Call
## Introduction
This system consists of boxes with LEDs in them connected to an ESP8266 wifi module running a web-server in Lua via NodeMCU. The LEDs should turn on when you are on a call and don't want to be disturbed. The use of wifi means that you and the LED box can be quite far apart in the house.

The PoC simply used the web-browser accessing a page directly on the LED box web-server to toggle the LEDs on/off. The big disadvantage of that is that you always need to know the IP addresses. These can change under DHCP or be a complete pain to manually manage if fixed.

So we need a centralised control system to enable you to manage multiple LEDs easily.

* Each box has an ESP8266, some LEDs, some transistors, some resistors, a 3.3V regulator, a programmming cable and a power lead for 5V USB power

## Details
TBD

## License

(MIT License)

Copyright (c) 2015 Conor O'Neill conor@conoroneill.com
Portions Copyright (c) 2014 Qawelesizwe Mlilo qawemlilo@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
