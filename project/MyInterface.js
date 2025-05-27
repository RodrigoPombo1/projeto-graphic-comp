import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor(selectedTag = 'tag_1') {
        super();
        this.tags = ['tag_1', 'tag_2', 'tag_3', 'tag_4', 'tag_5', 'tag_6', 'tag_7', 'tag_8'];
        this.selectedTag = selectedTag;
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.initKeys();

        // @ts-ignore
        this.gui.add(this, 'selectedTag', this.tags)
            .name('Tag Selected')
            .onChange(this.onTagChanged.bind(this));

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }


    onTagChanged(value) {
        // call the global reloadScene function
        // @ts-ignore
        if (typeof window.reloadScene === 'function') {
            // @ts-ignore
            window.reloadScene(value);
        }
        console.log(`Tag changed to: ${value}`);
    }
}