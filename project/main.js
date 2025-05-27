
import {CGFapplication} from '../lib/CGF.js';
import { MyScene } from './MyScene.js';
import { MyInterface } from './MyInterface.js';

let app, myScene, myInterface;

export function reloadScene(tag) {
    // destroy the previous GUI if it exists
    if (myInterface && myInterface.gui) {
        myInterface.gui.destroy();
    }

    myScene = new MyScene();
    myScene.selectedTag = tag;
    myInterface = new MyInterface(tag);

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);
}

function main()
{
    app = new CGFapplication(document.body);
    myScene = new MyScene();
    myInterface = new MyInterface(myScene.selectedTag);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

    app.run();

    // @ts-ignore
    window.reloadScene = reloadScene;
}

main();