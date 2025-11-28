import { Column, Entity, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Products } from "./Products";

@Index("product_images_pkey", ["id"], { unique: true })
@Entity("product_images", { schema: "public" })
export class ProductImages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "product_id", length: 50 })
  productId!: string;

  @Column("boolean", { name: "is_main", default: false })
  isMain!: boolean;
  @Column("character varying", { name: "color", length: 50 , nullable: true })
  color!: string | null;
  @Column("text", { name: "image_url", nullable: true })
  imageUrl!: string | null;

  @ManyToOne(() => Products, (products) => products.productImages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product!: Relation<Products>;
}