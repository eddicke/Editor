var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var MainToolbar = (function () {
            /**
            * Constructor
            * @param core: the editor core instance
            */
            function MainToolbar(core) {
                // Public members
                this.container = "BABYLON-EDITOR-MAIN-TOOLBAR";
                this.toolbar = null;
                this.panel = null;
                this.particleSystemMenu = null;
                this.particleSystemCopyItem = null;
                this.particleSystemPasteItem = null;
                this._plugins = [];
                this._mainProject = "MAIN-PROJECT";
                this._mainProjectOpenFiles = "MAIN-PROJECT-OPEN-FILES";
                this._mainProjectReload = "MAIN-PROJECT-RELOAD";
                this._mainProjectNew = "MAIN-PROJECT-NEW";
                this._projectExportCode = "PROJECT-EXPORT-CODE";
                this._projectExportBabylonScene = "PROJECT-EXPORT-BABYLON-SCENE";
                this._projectSaveLocal = "PROJECT-SAVE-LOCAL";
                this._projectTemplateLocal = "PROJECT-TEMPLATE-LOCAL";
                this._projectSaveStorage = "PROJECT-CONNECT-STORAGE";
                this._projectTemplateStorage = "PROJECT-TEMPLATE-STORAGE";
                this._mainEdit = "MAIN-EDIT";
                this._mainEditLaunch = "EDIT-LAUNCH";
                this._mainEditTextures = "EDIT-TEXTURES";
                this._mainAdd = "MAIN-ADD";
                this._addSkyMesh = "ADD-SKY-MESH";
                this._addWaterMesh = "ADD-WATER-MESH";
                this._addLensFlare = "ADD-LENS-FLARE";
                this._addReflectionProbe = "ADD-REFLECTION-PROBE";
                this._addRenderTarget = "ADD-RENDER-TARGET";
                this._addParticleSystem = "ADD-PARTICLE-SYSTEM";
                this._particlesMain = "PARTICLES-MAIN";
                this._particlesCopy = "PARTICLES-COPY";
                this._particlesPaste = "PARTICLES-PASTE";
                this._particlesPlay = "PARTICLES-PLAY";
                this._particlesStop = "PARTICLES-STOP";
                // Initialize
                this._editor = core.editor;
                this.core = core;
                this.panel = this._editor.layouts.getPanelFromType("top");
                // Register this
                this.core.updates.push(this);
                this.core.eventReceivers.push(this);
            }
            // Pre update
            MainToolbar.prototype.onPreUpdate = function () {
            };
            // Post update
            MainToolbar.prototype.onPostUpdate = function () {
            };
            // Event
            MainToolbar.prototype.onEvent = function (event) {
                var _this = this;
                if (event.eventType === EDITOR.EventType.KEY_EVENT) {
                    if (event.keyEvent.control && event.keyEvent.key === "s" && !event.keyEvent.isDown) {
                        this._callSaveAction(EDITOR.Tools.CheckIfElectron() ? this._projectSaveLocal : this._projectSaveStorage);
                    }
                    else if (event.keyEvent.shift && event.keyEvent.control && event.keyEvent.key === "s" && !event.keyEvent.isDown) {
                        this._callSaveAction(EDITOR.Tools.CheckIfElectron() ? this._projectTemplateLocal : this._projectTemplateStorage);
                    }
                }
                else if (event.eventType === EDITOR.EventType.GUI_EVENT && event.guiEvent.eventType === EDITOR.GUIEventType.TOOLBAR_MENU_SELECTED) {
                    if (event.guiEvent.caller !== this.toolbar || !event.guiEvent.data) {
                        return false;
                    }
                    var id = event.guiEvent.data;
                    var selected = this.toolbar.decomposeSelectedMenu(id);
                    if (!selected || !selected.hasParent)
                        return false;
                    // Project
                    if (selected.parent === this._mainProject) {
                        if (selected.selected === this._mainProjectOpenFiles) {
                            EDITOR.Tools.OpenFileBrowser(this.core, "#BABYLON-EDITOR-LOAD-SCENE-FILE", function (data) {
                                //this._editor.filesInput.loadFiles(data);
                                if (data.target.files.length === 0)
                                    return;
                                _this.core.editor.reloadScene(true, data);
                            }, true);
                        }
                        else if (selected.selected === this._mainProjectReload) {
                            EDITOR.GUI.GUIDialog.CreateDialog("Are you sure to reload the project ?", "Reload the project", function () {
                                _this.core.editor.reloadScene(true);
                            });
                        }
                        else if (selected.selected === this._mainProjectNew) {
                            EDITOR.GUI.GUIDialog.CreateDialog("Are you sure to create a new project ?", "Create a new project", function () {
                                _this._editor.createNewProject();
                            });
                        }
                        else if (selected.selected === this._projectExportCode) {
                            var exporter = new EDITOR.Exporter(this.core);
                            exporter.openSceneExporter();
                        }
                        else if (selected.selected === this._projectExportBabylonScene) {
                            var babylonExporter = new EDITOR.BabylonExporter(this.core);
                            babylonExporter.createUI();
                        }
                        else {
                            this._callSaveAction(selected.selected);
                        }
                        return true;
                    }
                    // Edit
                    if (selected.parent === this._mainEdit) {
                        if (selected.selected === this._mainEditLaunch) {
                            var launchEditor = new EDITOR.LaunchEditor(this.core);
                        }
                        else if (selected.selected === this._mainEditTextures) {
                            var textureEditor = new EDITOR.GUITextureEditor(this.core, "");
                        }
                        return true;
                    }
                    // Add
                    if (selected.parent === this._mainAdd) {
                        if (selected.selected === this._addLensFlare) {
                            EDITOR.SceneFactory.AddLensFlareSystem(this.core);
                        }
                        else if (selected.selected === this._addSkyMesh) {
                            EDITOR.SceneFactory.AddSkyMesh(this.core);
                        }
                        else if (selected.selected === this._addWaterMesh) {
                            EDITOR.SceneFactory.AddWaterMesh(this.core);
                        }
                        else if (selected.selected === this._addReflectionProbe) {
                            EDITOR.SceneFactory.AddReflectionProbe(this.core);
                        }
                        else if (selected.selected === this._addRenderTarget) {
                            EDITOR.SceneFactory.AddRenderTargetTexture(this.core);
                        }
                        return true;
                    }
                    // Particles
                    if (selected.parent === this._particlesMain) {
                        if (selected.selected === this._addParticleSystem) {
                            EDITOR.SceneFactory.AddParticleSystem(this.core);
                        }
                        else if (selected.selected === this._particlesCopy) {
                            EDITOR.GUIParticleSystemEditor._CopiedParticleSystem = EDITOR.GUIParticleSystemEditor._CurrentParticleSystem;
                        }
                        else if (selected.selected === this._particlesPaste) {
                            if (!EDITOR.GUIParticleSystemEditor._CopiedParticleSystem)
                                return true;
                            //var emitter = GUIParticleSystemEditor._CopiedParticleSystem.emitter;
                            var selectedEmitter = this.core.editor.sceneGraphTool.sidebar.getSelectedNode();
                            if (!selectedEmitter || !selectedEmitter.data || !selectedEmitter.data.position)
                                return true;
                            var newParticleSystem = EDITOR.GUIParticleSystemEditor.CreateParticleSystem(this.core.currentScene, EDITOR.GUIParticleSystemEditor._CopiedParticleSystem.getCapacity(), EDITOR.GUIParticleSystemEditor._CopiedParticleSystem, selectedEmitter.data);
                            EDITOR.Event.sendSceneEvent(newParticleSystem, EDITOR.SceneEventType.OBJECT_ADDED, this.core);
                            this._editor.editionTool.updateEditionTool();
                        }
                        else if (selected.selected === this._particlesPlay) {
                            EDITOR.GUIParticleSystemEditor.PlayStopAllParticleSystems(this.core.currentScene, true);
                        }
                        else if (selected.selected === this._particlesStop) {
                            EDITOR.GUIParticleSystemEditor.PlayStopAllParticleSystems(this.core.currentScene, false);
                        }
                        return true;
                    }
                    for (var i = 0; i < this._plugins.length; i++) {
                        if (selected.parent === this._plugins[i].menuID) {
                            this._plugins[i].onMenuItemSelected(selected.selected);
                            return true;
                        }
                    }
                }
                return false;
            };
            // Creates the UI
            MainToolbar.prototype.createUI = function () {
                if (this.toolbar != null)
                    this.toolbar.destroy();
                this.toolbar = new EDITOR.GUI.GUIToolbar(this.container, this.core);
                var menu = this.toolbar.createMenu("menu", this._mainProject, "Project", "icon-folder");
                this.toolbar.createMenuItem(menu, "button", this._mainProjectOpenFiles, "Open Files", "icon-copy");
                this.toolbar.createMenuItem(menu, "button", this._mainProjectReload, "Reload...", "icon-copy");
                this.toolbar.addBreak(menu);
                this.toolbar.createMenuItem(menu, "button", this._mainProjectNew, "New...", "icon-copy");
                this.toolbar.addBreak(menu);
                this.toolbar.createMenuItem(menu, "button", this._projectExportCode, "Export...", "icon-export");
                this.toolbar.createMenuItem(menu, "button", this._projectExportBabylonScene, "Export .babylon Scene...", "icon-export");
                this.toolbar.addBreak(menu);
                if (!EDITOR.Tools.CheckIfElectron()) {
                    this.toolbar.createMenuItem(menu, "button", this._projectSaveStorage, "Save on OneDrive", "icon-one-drive");
                    this.toolbar.createMenuItem(menu, "button", this._projectTemplateStorage, "Template on OneDrive", "icon-one-drive");
                }
                else {
                    this.toolbar.createMenuItem(menu, "button", this._projectSaveLocal, "Save...", "icon-save");
                    this.toolbar.createMenuItem(menu, "button", this._projectTemplateLocal, "Create template...", "icon-save");
                }
                //...
                menu = this.toolbar.createMenu("menu", "MAIN-EDIT", "Edit", "icon-edit");
                this.toolbar.createMenuItem(menu, "button", this._mainEditLaunch, "Animate at Launch...", "icon-play-game");
                this.toolbar.addBreak(menu);
                this.toolbar.createMenuItem(menu, "button", this._mainEditTextures, "Edit Textures...", "icon-copy");
                //...
                menu = this.toolbar.createMenu("menu", this._mainAdd, "Add", "icon-add");
                this.toolbar.createMenuItem(menu, "button", this._addLensFlare, "Add Lens Flare", "icon-lens-flare");
                this.toolbar.addBreak(menu);
                this.toolbar.createMenuItem(menu, "button", this._addSkyMesh, "Add Sky", "icon-shaders");
                this.toolbar.createMenuItem(menu, "button", this._addWaterMesh, "Add Water", "icon-water");
                this.toolbar.addBreak(menu);
                this.toolbar.createMenuItem(menu, "button", this._addReflectionProbe, "Add Reflection Probe", "icon-effects");
                this.toolbar.createMenuItem(menu, "button", this._addRenderTarget, "Add Render Target Texture", "icon-camera");
                //...
                this.particleSystemMenu = menu = this.toolbar.createMenu("menu", this._particlesMain, "Particles", "icon-particles");
                this.toolbar.createMenuItem(menu, "button", this._addParticleSystem, "Add Particle System", "icon-particles");
                this.toolbar.addBreak(menu);
                this.particleSystemCopyItem = this.toolbar.createMenuItem(menu, "button", this._particlesCopy, "Copy Selected Particle System", "icon-copy", false, true);
                this.particleSystemPasteItem = this.toolbar.createMenuItem(menu, "button", this._particlesPaste, "Paste Particle System", "icon-copy", false, true);
                this.toolbar.addBreak(menu);
                this.toolbar.createMenuItem(menu, "button", this._particlesPlay, "Start All Particles", "icon-play-game");
                this.toolbar.createMenuItem(menu, "button", this._particlesStop, "Stop All Particles", "icon-error");
                //...
                for (var i = 0; i < EDITOR.PluginManager.MainToolbarPlugins.length; i++)
                    this._plugins.push(new EDITOR.PluginManager.MainToolbarPlugins[i](this));
                // Build element
                this.toolbar.buildElement(this.container);
            };
            // Calls save actions
            MainToolbar.prototype._callSaveAction = function (selected) {
                if (selected === this._projectSaveLocal) {
                    var storageExporter = new EDITOR.StorageExporter(this.core, "ElectronLocalStorage");
                    storageExporter.export();
                    EDITOR.FilesInput.FilesToLoad["scene.editorproject"] = EDITOR.Tools.CreateFile(EDITOR.Tools.ConvertStringToArray(EDITOR.ProjectExporter.ExportProject(this.core)), "scene.editorproject");
                }
                else if (selected === this._projectTemplateLocal) {
                    var storageExporter = new EDITOR.StorageExporter(this.core, "ElectronLocalStorage");
                    storageExporter.createTemplate();
                }
                else if (selected === this._projectSaveStorage) {
                    var storageExporter = new EDITOR.StorageExporter(this.core);
                    storageExporter.export();
                    EDITOR.FilesInput.FilesToLoad["scene.editorproject"] = EDITOR.Tools.CreateFile(EDITOR.Tools.ConvertStringToArray(EDITOR.ProjectExporter.ExportProject(this.core)), "scene.editorproject");
                }
                else if (selected === this._projectTemplateStorage) {
                    var storageExporter = new EDITOR.StorageExporter(this.core);
                    storageExporter.createTemplate();
                }
            };
            return MainToolbar;
        }());
        EDITOR.MainToolbar = MainToolbar;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.editor.mainToolbar.js.map
