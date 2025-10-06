import { Column, Entity, Index, ManyToOne, JoinColumn, Relation } from "typeorm";
import { Products } from "./Products";

@Index("product_images_pkey", ["id"], { unique: true })
@Entity("product_images", { schema: "public" })
export class ProductImages {
  @Column("character varying", { primary: true, name: "id", length: 50 })
  id!: string;

  @Column("character varying", { name: "product_id", length: 50 })
  productId!: string;

  @Column("boolean", { name: "is_main", default: false })
  isMain!: boolean;

  @Column("text", { name: "image_url", nullable: true })
  imageUrl!: string | null;

  @ManyToOne(() => Products, (products) => products.productImages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product!: Relation<Products>;
}