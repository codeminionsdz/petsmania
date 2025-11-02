"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSupabaseAdmin } from "@/lib/supabase-server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Plus, Edit2, Trash2, Save, X, TrendingUp, Package, ShoppingBag } from "lucide-react"
import { BRANDS } from "@/lib/categories-data"
import { OrderItems } from "@/components/order-items"

interface Product {
  id: string
  name: string
  description: string
  price: number
  promo_price?: number
  reduction?: number
  image_url: string
  animal: string
  type: string
  subtype?: string
  marque: string
  stock: number
  featured?: boolean
  out_of_stock?: boolean
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  city: string
  total_price: number
  status: string
  created_at: string
}

interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
  city?: string
  created_at: string
  updated_at?: string
}

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

const PRODUCT_TYPES = ["Accessoires", "Alimentaire", "Soin"]
const ANIMALS = ["cats", "dogs", "birds", "other"]

const SUBTYPES = {
  cats: {
    Accessoires: ["Arbre à chat", "Bac à litière", "Collier", "Jouets", "Coussin", "Gamelle", "Harnais"],
    Alimentaire: ["Croquettes", "Friandises", "Conserves", "Gelées", "Compléments alimentaires"],
    Soin: ["Brosses", "Shampoings", "Antiparasitaires"],
  },
  dogs: {
    Accessoires: ["Laisses", "Harnais", "Jouets", "Muselières", "Coussins", "Gamelles"],
    Alimentaire: ["Croquettes", "Friandises", "Conserves", "Compléments alimentaires"],
    Soin: ["Shampoings", "Brosses", "Eau de Cologne", "Antiparasitaires"],
  },
  birds: {
    Accessoires: ["Cages", "Nourrisseurs", "Jouets", "Volières"],
    Alimentaire: ["Graines", "Pâté", "Compléments alimentaires"],
  },
  other: {
    Accessoires: ["Cages", "Accessoires divers"],
    Alimentaire: ["Nourriture divers"],
    Soin: ["Soins divers"],
  },
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    promo_price: undefined,
    reduction: 0,
    image_url: "",
    animal: "cats",
    type: "Accessoires",
    subtype: "",
    marque: "",
    stock: 0,
    featured: false,
    out_of_stock: false,
  })

  useEffect(() => {
    setMounted(true)
    const auth = localStorage.getItem("adminAuth")
    if (auth) setIsAuthenticated(true)
  }, [])

  // Read admin password from environment (NEXT_PUBLIC_ used because this is a client component).
  // Note: for production it's more secure to validate admin credentials on the server-side
  // and avoid exposing any secret on the client. This is a small improvement to avoid
  // hardcoded strings in the codebase.
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
      setPassword("")
    } else {
      alert("Mot de passe incorrect")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
  }

  const fetchProducts = async () => {
    try {
      const supabase = await getSupabaseAdmin()
      const { data, error } = await supabase.from("products").select("*")
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      const supabase = await getSupabaseAdmin()
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
      if (error) throw error
      setOrders(data || [])

      // Calculate stats
      const totalRevenue = (data || []).reduce((sum: number, order: Order) => sum + order.total_price, 0)
      const pendingCount = (data || []).filter((order: Order) => order.status === "pending").length

      setStats({
        totalProducts: products.length,
        totalOrders: data?.length || 0,
        totalRevenue,
        pendingOrders: pendingCount,
      })
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const supabase = await getSupabaseAdmin()
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && mounted) {
      fetchProducts()
      fetchOrders()
      fetchUsers()
    }
  }, [isAuthenticated, mounted])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = await getSupabaseAdmin()
      let imageUrl = newProduct.image_url

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Erreur lors du téléchargement de l'image: ${uploadError.message}`)
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName)
          imageUrl = publicUrl
        }
      }

      const productData: any = {
        ...newProduct,
        image_url: imageUrl,
        promo_price: newProduct.promo_price || null,
      }

      if (editingId) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingId)
        if (error) throw error
      } else {
        const { id, ...insertData } = productData
        const { error } = await supabase.from("products").insert([insertData])
        if (error) throw error
      }

      setNewProduct({
        id: "",
        name: "",
        description: "",
        price: 0,
        promo_price: undefined,
        reduction: 0,
        image_url: "",
        animal: "cats",
        type: "Accessoires",
        subtype: "",
        marque: "",
        stock: 0,
        featured: false,
        out_of_stock: false,
      })
      setImageFile(null)

      setEditingId(null)
      fetchProducts()
      alert(editingId ? "Produit mis à jour avec succès!" : "Produit ajouté avec succès!")
    } catch (error: any) {
      console.error("[v0] Error saving product:", error)
      const errorMessage = error?.message || error?.details || 'Erreur inconnue'
      alert(`Erreur lors de la sauvegarde du produit: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setNewProduct(product)
    setImageFile(null) // Reset file on edit
    setEditingId(product.id)
  }

  const handleDeleteProduct = async (id: string) => {
    console.log("Delete product function called for id:", id)
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      console.log("Delete cancelled by user")
      return
    }

    console.log("Proceeding with delete for product:", id)
    try {
      const supabase = await getSupabaseAdmin()
      console.log("Supabase client obtained")
      const { error } = await supabase.from("products").delete().eq("id", id)
      console.log("Delete query executed, error:", error)
      if (error) {
        console.error("Error deleting product:", error)
        throw error
      }

      console.log("Product deleted successfully, fetching updated products")
      fetchProducts()
      alert("Produit supprimé avec succès!")
    } catch (error: any) {
      console.error("[v0] Error deleting product:", error)
      alert(`Erreur lors de la suppression du produit: ${error.message || error.details || 'Erreur inconnue'}`)
    }
  }

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const supabase = await getSupabaseAdmin()
      const { error } = await supabase.from("orders").update({ status }).eq("id", id)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error("[v0] Error updating order:", error)
    }
  }

  const handleDeleteOrder = async (id: string) => {
    console.log("Delete order function called for id:", id)
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      console.log("Delete cancelled by user")
      return
    }

    console.log("Proceeding with delete for order:", id)
    try {
      const supabase = await getSupabaseAdmin()
      console.log("Supabase client obtained for order delete")
      // First delete order items
      const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", id)
      console.log("Order items delete executed, error:", itemsError)
      if (itemsError) {
        console.error("Error deleting order items:", itemsError)
        throw itemsError
      }

      // Then delete the order
      const { error } = await supabase.from("orders").delete().eq("id", id)
      console.log("Order delete executed, error:", error)
      if (error) {
        console.error("Error deleting order:", error)
        throw error
      }

      console.log("Order deleted successfully, fetching updated orders")
      fetchOrders()
      alert("Commande supprimée avec succès!")
    } catch (error: any) {
      console.error("[v0] Error deleting order:", error)
      alert(`Erreur lors de la suppression de la commande: ${error.message || error.details || 'Erreur inconnue'}`)
    }
  }

  if (!mounted) return null

  if (!isAuthenticated) {
    return (
      <div>
        <Header cartCount={0} />

        <main className="max-w-md mx-auto px-4 py-12">
          <Card className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Tableau de Bord Admin</h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                />
              </div>

              <Button type="submit" className="w-full">
                Connexion
              </Button>
            </form>
          </Card>
        </main>

        <Footer language="fr" />
      </div>
    )
  }

  return (
    <div>
      <Header cartCount={0} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Tableau de Bord Admin</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Package, label: "Produits", value: stats.totalProducts, color: "text-blue-600" },
            { icon: ShoppingBag, label: "Commandes", value: stats.totalOrders, color: "text-green-600" },
            {
              icon: TrendingUp,
              label: "Chiffre d'affaires",
              value: `${stats.totalRevenue.toLocaleString()} DA`,
              color: "text-purple-600",
            },
            { icon: X, label: "En attente", value: stats.pendingOrders, color: "text-orange-600" },
          ].map((stat, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-muted rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                {editingId ? "Modifier le produit" : "Ajouter un produit"}
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom du produit</label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Marque</label>
                    <select
                      value={newProduct.marque}
                      onChange={(e) => setNewProduct({ ...newProduct, marque: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Sélectionner une marque</option>
                      {BRANDS.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Animal</label>
                    <select
                      value={newProduct.animal}
                      onChange={(e) => setNewProduct({ ...newProduct, animal: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      {ANIMALS.map((animal) => (
                        <option key={animal} value={animal}>
                          {animal.charAt(0).toUpperCase() + animal.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={newProduct.type}
                      onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      {PRODUCT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sous-type</label>
                    <select
                      value={newProduct.subtype || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, subtype: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Sélectionner un sous-type</option>
                      {(SUBTYPES[newProduct.animal as keyof typeof SUBTYPES]?.[newProduct.type as keyof typeof SUBTYPES[keyof typeof SUBTYPES]] || []).map((subtype) => (
                        <option key={subtype} value={subtype}>
                          {subtype}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prix (DA)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value ? Number.parseFloat(e.target.value) : 0 })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prix Promo (DA)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.promo_price || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          promo_price: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="Optionnel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock</label>
                    <Input
                      type="number"
                      value={newProduct.stock || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value ? Number.parseInt(e.target.value) : 0 })}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProduct.featured || false}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    />
                    <label htmlFor="featured" className="text-sm font-medium">Produit en vedette</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="out_of_stock"
                      checked={newProduct.out_of_stock || false}
                      onChange={(e) => setNewProduct({ ...newProduct, out_of_stock: e.target.checked })}
                    />
                    <label htmlFor="out_of_stock" className="text-sm font-medium">Rupture de stock</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Réduction (%)</label>
                    <Input
                      type="number"
                      value={newProduct.reduction || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, reduction: e.target.value ? Number.parseInt(e.target.value) : 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock</label>
                    <Input
                      type="number"
                      value={newProduct.stock || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value ? Number.parseInt(e.target.value) : 0 })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                    {imageFile && <p className="text-sm text-muted-foreground mt-1">{imageFile.name}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProduct.featured || false}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">En vedette</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="out_of_stock"
                      checked={newProduct.out_of_stock || false}
                      onChange={(e) => setNewProduct({ ...newProduct, out_of_stock: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="out_of_stock" className="text-sm font-medium">Rupture de stock</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="gap-2">
                    <Save className="w-4 h-4" />
                    {editingId ? "Mettre à jour" : "Ajouter"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => {
                        setEditingId(null)
                        setNewProduct({
                          id: "",
                          name: "",
                          description: "",
                          price: 0,
                          promo_price: undefined,
                          reduction: 0,
                          image_url: "",
                          animal: "cats",
                          type: "Accessoires",
                          subtype: "",
                          marque: "",
                          stock: 0,
                          featured: false,
                          out_of_stock: false,
                        })
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            {/* Products List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Tous les produits ({products.length})</h2>
              {products.map((product) => (
                <Card key={product.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.marque} • {product.type} • {product.subtype}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{product.price.toFixed(2)} DA</p>
                      {product.promo_price && (
                        <p className="text-sm text-green-600">{product.promo_price.toFixed(2)} DA (promo)</p>
                      )}
                      <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                      {product.featured && (
                        <p className="text-xs text-blue-600 font-medium">En vedette</p>
                      )}
                      {product.out_of_stock && (
                        <p className="text-xs text-red-600 font-medium">Rupture de stock</p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <img
                        src={product.image_url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("Delete button clicked for product:", product.id)
                        handleDeleteProduct(product.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold">{order.customer_name}</h3>
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.address}, {order.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">{order.total_price.toFixed(2)} DA</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
        </div>

        <OrderItems orderId={order.id} />

        <div className="flex gap-2">
          <select
            value={order.status}
            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm flex-1"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
          </select>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("Button clicked for order:", order.id)
              handleDeleteOrder(order.id)
            }}
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Utilisateurs inscrits ({users.length})</h2>
              {users.map((user) => (
                <Card key={user.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.first_name || user.last_name || "Nom non défini"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                      {(user.address || user.city) && (
                        <p className="text-xs text-muted-foreground">
                          {user.address}{user.city && `, ${user.city}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Inscrit le: {new Date(user.created_at).toLocaleDateString("fr-FR")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dernière mise à jour: {user.updated_at ? new Date(user.updated_at).toLocaleDateString("fr-FR") : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer language="fr" />
    </div>
  )
}
