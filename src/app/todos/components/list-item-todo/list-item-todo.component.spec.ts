import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemTodoComponent } from './list-item-todo.component';

describe('ListItemTodoComponent', () => {
  let component: ListItemTodoComponent;
  let fixture: ComponentFixture<ListItemTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemTodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListItemTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
