import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherList } from './voucher-list';

describe('VoucherList', () => {
  let component: VoucherList;
  let fixture: ComponentFixture<VoucherList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherList],
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
