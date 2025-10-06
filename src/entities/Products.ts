import { Column, Entity, Index, OneToMany,Relation } from "typeorm";
import { Orders } from "./Orders";
import { ProductImages } from "./ProductImages";

@Index("products_pkey", ["id"], { unique: true })
@Entity("products", { schema: "public" })
export class Products {
  @Column("character varying", { primary: true, name: "id", length: 50 })
  id!: string;

  @Column("text", { name: "name" })
  name!: string;

  @Column("text", { name: "description", nullable: true })
  description!: string | null;

  @Column("numeric", { name: "price", precision: 10, scale: 2 })
  price!: string;

  @Column("enum", {
    name: "category",
    nullable: true,
    enum: ["electronics", "clothing", "home_garden", "books", "sports"],
  })
  category!:
    | "electronics"
    | "clothing"
    | "home_garden"
    | "books"
    | "sports"
    | null;

  @Column("text", { name: "image", nullable: true })
  image!: string | null;

  @OneToMany(() => Orders, (orders) => orders.product)
  orders!: Orders[];

  @OneToMany(() => ProductImages, (productImages) => productImages.product)
  productImages!: Relation<ProductImages[]>;
}