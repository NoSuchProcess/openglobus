goog.provide('og.Entity');

goog.require('og.math.Vector3');
goog.require('og.Billboard');
goog.require('og.Label');

og.Entity = function (options) {

    options = options || {};

    this.position = new og.math.Vector3();
    this.visibility = true;
    this.id = options.id || ("noname_" + og.Entity.__staticCounter++);

    this.billboard = null;
    this.label = null;
    //...

    this.childrenNodes = [];
    this.parent = null;

    this._entityCollection = null;
    this._entityCollectionIndex = -1;
};

og.Entity.__staticCounter = 0;

og.Entity.prototype.addTo = function (entityCollection) {
    entityCollection.add(this);
};

og.Entity.prototype.remove = function () {
    this._entityCollection && this._entityCollection.removeEntity(this);
};

og.Entity.prototype.setVisibility = function (visibility) {
    this.visibility = visibility;

    //billboards
    this.billboard && this.billboard.setVisibility(visibility);

    //labels
    this.label && this.label.setVisibility(visibility);

    for (var i = 0; i < this.childrenNodes.length; i++) {
        this.childrenNodes[i].setVisibility(visibility);
    }
};

og.Entity.prototype.setPosition3v = function (position) {
    this.setPosition(position.x, position.y, position.z);
};

og.Entity.prototype.setPosition = function (x, y, z) {

    var p = this.position;

    p.x = x;
    p.y = y;
    p.z = z;

    //billboards
    this.billboard && this.billboard.setPosition3v(p);

    //labels
    this.label && this.label.setPosition3v(p);

    for (var i = 0; i < this.childrenNodes.length; i++) {
        this.childrenNodes[i].setPosition3v(p);
    }
};

og.Entity.prototype.setBillboard = function (billboard) {
    if (this.billboard) {
        this.billboard.remove();
    }
    this.billboard = billboard;
    this.billboard.setPosition3v(this.position);
    this.billboard.setVisibility(this.visbility);
    this._entityCollection && this._entityCollection._billboardHandler.add(billboard);
};

og.Entity.prototype.setLabel = function (label) {
    if (this.label) {
        this.label.remove();
    }
    this.label = label;
    this.label.setPosition3v(this.position);
    this.label.setVisibility(this.visbility);
    this._entityCollection && this._entityCollection._labelHandler.add(label);
};

og.Entity.prototype.appendChild = function (entity) {
    entity._entityCollection = this._entityCollection;
    entity.parent = this;
    this.childrenNodes.push(entity);
    this._entityCollection && this._entityCollection._addRecursively(entity);
};