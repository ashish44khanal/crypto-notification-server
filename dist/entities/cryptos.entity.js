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
exports.Cryptos = void 0;
const typeorm_1 = require("typeorm");
const common_entity_1 = require("../commons/common-entity");
const watchlist_notification_entity_1 = require("./watchlist-notification.entity");
const watchlist_entity_1 = require("./watchlist.entity");
let Cryptos = class Cryptos extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Cryptos.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cryptos.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cryptos.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cryptos.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cryptos.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cryptos.prototype, "market_cap", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cryptos.prototype, "changeIn24", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cryptos.prototype, "crypto_details_link", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => watchlist_entity_1.Watchlist, (watchlist) => watchlist.coin_id),
    __metadata("design:type", watchlist_entity_1.Watchlist)
], Cryptos.prototype, "watchlist", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => watchlist_notification_entity_1.WatchlistNotification, (notification) => notification.coin),
    __metadata("design:type", watchlist_entity_1.Watchlist)
], Cryptos.prototype, "notification", void 0);
Cryptos = __decorate([
    (0, typeorm_1.Entity)()
], Cryptos);
exports.Cryptos = Cryptos;
