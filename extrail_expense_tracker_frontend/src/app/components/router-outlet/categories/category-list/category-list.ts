import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriesModel, CategoryScope, CategoryType } from '../../../../models/categories.model';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  @Input() categories: CategoriesModel[] = [];
  @Input() userId!: number;
  @Output() edit = new EventEmitter<CategoriesModel>();
  @Output() delete = new EventEmitter<number>();

  getCategoryTypeColor(type: CategoryType): string {
    return type === CategoryType.income ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getCategoryTypeIcon(type: CategoryType): string {
    return type === CategoryType.income ? '💰' : '💸';
  }

  isUserCategory(category: CategoriesModel): boolean {
    return category.scope === CategoryScope.user && category.ownerUser === this.userId;
  }

  onEdit(category: CategoriesModel): void {
    this.edit.emit(category);
  }

  onDelete(categoryId: number): void {
    this.delete.emit(categoryId);
  }
}
