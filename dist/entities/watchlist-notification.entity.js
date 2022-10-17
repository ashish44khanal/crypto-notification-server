"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistNotification = void 0;
const typeorm_1 = require("typeorm");
const common_entity_1 = require("../commons/common-entity");
const cryptos_entity_1 = require("./cryptos.entity");
const user_entity_1 = require("./user.entity");
let WatchlistNotification = class WatchlistNotification extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], WatchlistNotification.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WatchlistNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.notification),
    __metadata("design:type", user_entity_1.User)
], WatchlistNotification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cryptos_entity_1.Cryptos, (coin) => coin.notification),
    __metadata("design:type", cryptos_entity_1.Cryptos)
], WatchlistNotification.prototype, "coin", void 0);
WatchlistNotification = __decorate([
    (0, typeorm_1.Entity)()
], WatchlistNotification);
exports.WatchlistNotification = WatchlistNotification;
