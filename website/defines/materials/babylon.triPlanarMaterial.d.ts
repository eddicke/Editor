declare module BABYLON {
    class TriPlanarMaterial extends Material {
        mixTexture: BaseTexture;
        diffuseTextureX: Texture;
        diffuseTextureY: Texture;
        diffuseTextureZ: Texture;
        normalTextureX: Texture;
        normalTextureY: Texture;
        normalTextureZ: Texture;
        tileSize: number;
        diffuseColor: Color3;
        specularColor: Color3;
        specularPower: number;
        disableLighting: boolean;
        maxSimultaneousLights: number;
        private _worldViewProjectionMatrix;
        private _renderId;
        private _defines;
        private _cachedDefines;
        constructor(name: string, scene: Scene);
        needAlphaBlending(): boolean;
        needAlphaTesting(): boolean;
        getAlphaTestTexture(): BaseTexture;
        private _checkCache(scene, mesh?, useInstances?);
        isReady(mesh?: AbstractMesh, useInstances?: boolean): boolean;
        bindOnlyWorldMatrix(world: Matrix): void;
        bind(world: Matrix, mesh?: Mesh): void;
        getAnimatables(): IAnimatable[];
        dispose(forceDisposeEffect?: boolean): void;
        clone(name: string): TriPlanarMaterial;
        serialize(): any;
        static Parse(source: any, scene: Scene, rootUrl: string): TriPlanarMaterial;
    }
}
