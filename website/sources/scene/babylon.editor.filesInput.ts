﻿module BABYLON.EDITOR {
    export class FilesInput extends BABYLON.FilesInput {
        constructor(core: EditorCore, sceneLoadedCallback, progressCallback,
            additionnalRenderLoopLogicCallback, textureLoadingCallback,
            startingProcessingFilesCallback)
        {
            super(core.engine, core.currentScene, core.canvas, null,
                progressCallback, additionnalRenderLoopLogicCallback,
                textureLoadingCallback, FilesInput._callbackStart(core));

            (<any>this)._sceneLoadedCallback = FilesInput._callback(sceneLoadedCallback, core, this)
        }

        private static _callbackStart(core: EditorCore): () => void {
            return () => {
                core.editor.layouts.lockPanel("main", "Loading...", true);
            };
        }

        private static _callback(callback: (file: File, scene: Scene) => void, core: EditorCore, filesInput: FilesInput): (file: File, scene: Scene) => void {
            var readFileCallback = (scene: Scene, jsFile: File) => {
                return (result: string) => {

                    ProjectImporter.ImportProject(core, result);
                    core.editor.sceneGraphTool.createUI();
                    core.editor.sceneGraphTool.fillGraph();
                    core.editor.timeline.reset();

                    if (jsFile.msClose)
                        jsFile.msClose();
                };
            };

            return (file: File, scene: Scene) => {
                var files: File[] = (<any>filesInput)._filesToLoad;
                var calledCallback = false;
                
                for (var i = 0; i < files.length; i++) {
                    if (files[i].name.indexOf(".editorproject") === -1)
                        continue;

                    BABYLON.Tools.ReadFile(files[i], readFileCallback(scene, files[i]), null);
                }

                scene.getEngine().hideLoadingUI();

                if (callback)
                    callback(file, scene);

                core.editor.layouts.unlockPanel("main");
            };
        }
    }
}