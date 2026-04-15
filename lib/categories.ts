export interface Category {
  id: number
  name: string
  nameKa: string
  parentId: number | null
}

// Static category tree — IDs match the backend database.
// Update IDs here if they differ from what the backend returns.
export const CATEGORIES: Category[] = [
  // ── Parents ────────────────────────────────────────────────────────────────
  { id: 100, name: 'Laptops', nameKa: 'ლეპტოპები', parentId: null },
  { id: 200, name: 'Components', nameKa: 'კომპონენტები', parentId: null },
  { id: 300, name: 'Accessories', nameKa: 'აქსესუარები', parentId: null },
  { id: 400, name: 'Gaming', nameKa: 'გეიმინგი', parentId: null },
  { id: 500, name: 'Storage', nameKa: 'მეხსიერება', parentId: null },
  { id: 600, name: 'Monitors', nameKa: 'მონიტორები', parentId: null },

  // ── Laptops ────────────────────────────────────────────────────────────────
  { id: 101, name: 'Gaming Laptops', nameKa: 'სათამაშო ლეპტოპები', parentId: 100 },
  { id: 102, name: 'Business Laptops', nameKa: 'ბიზნეს ლეპტოპები', parentId: 100 },
  { id: 103, name: 'Ultrabooks', nameKa: 'ულტრაბუქები', parentId: 100 },

  // ── Components ─────────────────────────────────────────────────────────────
  { id: 201, name: 'Processors (CPU)', nameKa: 'პროცესორები', parentId: 200 },
  { id: 202, name: 'Graphics Cards (GPU)', nameKa: 'ვიდეო ბარათები', parentId: 200 },
  { id: 203, name: 'Motherboards', nameKa: 'დედა დაფები', parentId: 200 },
  { id: 204, name: 'RAM', nameKa: 'ოპერატიული მეხსიერება', parentId: 200 },
  { id: 205, name: 'Power Supplies', nameKa: 'კვების ბლოკები', parentId: 200 },
  { id: 206, name: 'PC Cases', nameKa: 'კორპუსები', parentId: 200 },
  { id: 207, name: 'Cooling', nameKa: 'გაგრილება', parentId: 200 },

  // ── Accessories ────────────────────────────────────────────────────────────
  { id: 301, name: 'Keyboards', nameKa: 'კლავიატურები', parentId: 300 },
  { id: 302, name: 'Mice', nameKa: 'მაუსები', parentId: 300 },
  { id: 303, name: 'Headsets', nameKa: 'ყურსასმენები', parentId: 300 },
  { id: 304, name: 'Webcams', nameKa: 'ვებ-კამერები', parentId: 300 },
  { id: 305, name: 'Speakers', nameKa: 'დინამიკები', parentId: 300 },
  { id: 306, name: 'Other Accessories', nameKa: 'სხვა აქსესუარები', parentId: 300 },

  // ── Gaming ─────────────────────────────────────────────────────────────────
  { id: 401, name: 'Consoles', nameKa: 'კონსოლები', parentId: 400 },
  { id: 402, name: 'Controllers', nameKa: 'კონტროლერები', parentId: 400 },
  { id: 403, name: 'Gaming Chairs', nameKa: 'სათამაშო სავარძლები', parentId: 400 },

  // ── Storage ────────────────────────────────────────────────────────────────
  { id: 501, name: 'SSD', nameKa: 'SSD დისკები', parentId: 500 },
  { id: 502, name: 'HDD', nameKa: 'HDD დისკები', parentId: 500 },
  { id: 503, name: 'USB Drives', nameKa: 'ფლეშ დრაივები', parentId: 500 },

  // ── Monitors ───────────────────────────────────────────────────────────────
  { id: 601, name: 'Gaming Monitors', nameKa: 'სათამაშო მონიტორები', parentId: 600 },
  { id: 602, name: 'Office Monitors', nameKa: 'საოფისე მონიტორები', parentId: 600 },
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
