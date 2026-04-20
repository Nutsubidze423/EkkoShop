export interface Category {
  id: number
  name: string
  nameKa: string
  parentId: number | null
}

export const CATEGORIES: Category[] = [
  // ── Parents ────────────────────────────────────────────────────────────────
  { id: 1, name: 'Gaming Consoles & Accessories', nameKa: 'სათამაშო კონსოლები და აქსესუარები', parentId: null },
  { id: 2, name: 'PC Hardware & Components',      nameKa: 'PC კომპონენტები',                   parentId: null },
  { id: 3, name: 'PC & Gaming Peripherals',       nameKa: 'PC და გეიმინგ პერიფერია',            parentId: null },
  { id: 4, name: 'Gaming PCs & Laptops',          nameKa: 'სათამაშო PC და ლეპტოპები',           parentId: null },
  { id: 5, name: 'Services',                      nameKa: 'სერვისები',                          parentId: null },

  // ── Gaming Consoles & Accessories ─────────────────────────────────────────
  { id: 101, name: 'Consoles',                  nameKa: 'კონსოლები',               parentId: 1 },
  { id: 102, name: 'Gamepads & Controllers',    nameKa: 'გეიმპადები და კონტროლერები', parentId: 1 },
  { id: 103, name: 'Controller Accessories',    nameKa: 'კონტროლერის აქსესუარები', parentId: 1 },
  { id: 104, name: 'Gift Cards / Subscriptions',nameKa: 'სასაჩუქრე ბარათები',      parentId: 1 },

  // ── PC Hardware & Components ──────────────────────────────────────────────
  { id: 201, name: 'Processors (CPU)',          nameKa: 'პროცესორები',             parentId: 2 },
  { id: 202, name: 'Graphics Cards (GPU)',       nameKa: 'ვიდეო ბარათები',         parentId: 2 },
  { id: 203, name: 'Motherboards',              nameKa: 'დედა დაფები',             parentId: 2 },
  { id: 204, name: 'Memory (RAM)',               nameKa: 'ოპერატიული მეხსიერება',  parentId: 2 },
  { id: 205, name: 'Storage (SSD / HDD / NVMe)',nameKa: 'მეხსიერება',              parentId: 2 },
  { id: 206, name: 'Power Supplies (PSU)',       nameKa: 'კვების ბლოკები',         parentId: 2 },
  { id: 207, name: 'PC Cases',                  nameKa: 'კორპუსები',               parentId: 2 },
  { id: 208, name: 'Cooling Solutions',         nameKa: 'გაგრილება',               parentId: 2 },
  { id: 209, name: 'Mining / Crypto Gear',      nameKa: 'მაინინგი',                parentId: 2 },

  // ── PC & Gaming Peripherals ───────────────────────────────────────────────
  { id: 301, name: 'Monitors',                  nameKa: 'მონიტორები',              parentId: 3 },
  { id: 302, name: 'Keyboards',                 nameKa: 'კლავიატურები',            parentId: 3 },
  { id: 303, name: 'Mice',                      nameKa: 'მაუსები',                 parentId: 3 },
  { id: 304, name: 'Headsets',                  nameKa: 'ყურსასმენები',            parentId: 3 },
  { id: 305, name: 'Speakers',                  nameKa: 'დინამიკები',              parentId: 3 },
  { id: 306, name: 'Other Accessories',         nameKa: 'სხვა აქსესუარები',       parentId: 3 },

  // ── Gaming PCs & Laptops ──────────────────────────────────────────────────
  { id: 401, name: 'Desktop PCs',               nameKa: 'დესკტოპ PC',              parentId: 4 },
  { id: 402, name: 'Gaming Laptops',            nameKa: 'სათამაშო ლეპტოპები',      parentId: 4 },
  { id: 403, name: 'Laptop Accessories',        nameKa: 'ლეპტოპის აქსესუარები',    parentId: 4 },

  // ── Services ──────────────────────────────────────────────────────────────
  { id: 501, name: 'PC / Laptop Assembly',      nameKa: 'PC / ლეპტოპის აწყობა',   parentId: 5 },
  { id: 502, name: 'PC / Laptop Repair',        nameKa: 'PC / ლეპტოპის შეკეთება', parentId: 5 },
  { id: 503, name: 'Upgrades & Custom Builds',  nameKa: 'განახლება და აწყობა',     parentId: 5 },
  { id: 504, name: 'Data Recovery',             nameKa: 'მონაცემების აღდგენა',     parentId: 5 },
  { id: 505, name: 'Consultation & Troubleshooting', nameKa: 'კონსულტაცია',        parentId: 5 },
]

export function getParents(): Category[] {
  return CATEGORIES.filter((c) => c.parentId === null)
}

export function getChildren(parentId: number): Category[] {
  return CATEGORIES.filter((c) => c.parentId === parentId)
}

export function getCategoryById(id: number): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

export function getDescendantIds(id: number): number[] {
  const children = getChildren(id)
  if (children.length === 0) return [id]
  return children.flatMap((c) => getDescendantIds(c.id))
}
