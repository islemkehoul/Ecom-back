import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";

@Index("idx_orders_location", ["customerCity", "customerRegion"], {})
@Index("idx_orders_product_id", ["productId"], {})
@Entity("orders", { schema: "public" })
export class Orders {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "product_id", length: 50 })
  productId!: string;

  @Column("character varying", { name: "customer_name", length: 255 })
  customerName!: string;

  @Column("character varying", { name: "customer_phone", length: 20 })
  customerPhone!: string;

  @Column("character varying", { name: "customer_city", length: 100 })
  customerCity!: string;

  @Column("character varying", { name: "customer_region", length: 100 })
  customerRegion!: string;
  
  @Column("character varying", { name: "sku", length: 50 })
  sku!: string;

  @ManyToOne(() => Products, (products) => products.orders, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product!: Products;
}
