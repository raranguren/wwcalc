import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RoleIconComponent } from "./role-icon.component";
import { Role } from "../models/role";

describe('RoleIconComponent', () => {
    let component: RoleIconComponent;
    let fixture: ComponentFixture<RoleIconComponent>;

    beforeEach(async () => {
        fixture = TestBed.createComponent(RoleIconComponent);
        fixture.componentRef.setInput("role", Role.WEREWOLF);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

});
