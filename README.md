# ngGeometry
Angular directive for a simple Three.JS scene

# Usage
ngGeometry is used only as an HTML attribute. It sets the scene dimensions equal to the dimensions of the HTML element it's added to.
You configure the directive with the following options:

#### `object-color`

HEX color value for the object in the scene



#### `background-color`

HEX color value for the background


#### `wireframe`

Boolean value for whether the object should render as a wireframe or not

#### `size`

The size of the object. 1 is the default.

#### `geometry`

The type of object geoemtry to use. Takes the options `octahedron`, `sphere`, or `cube`.


#Example 

```html
  <div nx-geometry
      <-- class used to set dimensions -->
      class="header-overlay"
      geometry="sphere"
      object-color="#2aa198"
      background-color="#fefcf5"
      wireframe="true"
      size="5"
    ></div>
```
