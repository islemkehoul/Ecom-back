import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";

@Index("product_variants_pkey", ["id"], { unique: true })
@Entity("product_variants", { schema: "public" })
export class ProductVariants {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "product_id", length: 50 })
  productId!: string;

  @Column("character varying", { name: "size", length: 50 })
  size!: string;

  @Column("character varying", { name: "color", length: 50 })
  color!: string;

  @Column("integer", { name: "quantity" })
  quantity!: number;

  @Column("character varying", { name: "sku", length: 50 })
  sku!: string;

  @Column("numeric", { name: "price", precision: 10, scale: 2 })
  price!: string;

  @ManyToOne(() => Products, (products) => products.productVariants, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product!: Products;
}
