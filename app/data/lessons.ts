export interface Lesson {
  id: string;
  language: string;
  languageSlug: string;
  project: string;
  projectSlug: string;
  description: string;
  fileName: string;
  code: string;
  color: string;
}

export const lessons: Lesson[] = [
  {
    id: "javascript-express",
    language: "JavaScript",
    languageSlug: "javascript",
    project: "Express Server",
    projectSlug: "express",
    description: "REST API with Express.js",
    fileName: "server.js",
    color: "#f7df1e",
    code: `const express = require("express");
const app = express();

app.use(express.json());

const tasks = new Map();
let nextId = 1;

app.get("/api/tasks", (req, res) => {
  const items = [...tasks.values()];
  res.json({ data: items, count: items.length });
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, priority = "medium" } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = { id: nextId++, title, priority, done: false };
    tasks.set(task.id, task);
    res.status(201).json(task);
  } catch (err) {
    console.error(\`Failed to create task: \${err.message}\`);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = tasks.delete(id);
  res.json({ success: deleted });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`,
  },
  {
    id: "typescript-repository",
    language: "TypeScript",
    languageSlug: "typescript",
    project: "Repository Pattern",
    projectSlug: "repository",
    description: "Generic repository with interfaces and generics",
    fileName: "repository.ts",
    color: "#3178c6",
    code: `interface Entity {
  id: string;
  createdAt: Date;
}

interface Repository<T extends Entity> {
  findById(id: string): T | undefined;
  findAll(filter?: Partial<T>): T[];
  save(entity: T): void;
  delete(id: string): boolean;
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
  private store = new Map<string, T>();

  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  findAll(filter?: Partial<T>): T[] {
    const items = [...this.store.values()];
    if (!filter) return items;
    return items.filter((item) => {
      return Object.entries(filter).every(
        ([key, val]) => item[key as keyof T] === val
      );
    });
  }

  save(entity: T): void {
    this.store.set(entity.id, { ...entity, createdAt: new Date() });
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  get size(): number {
    return this.store.size;
  }
}

export type { Entity, Repository };
export { InMemoryRepository };`,
  },
  {
    id: "python-dataprocessor",
    language: "Python",
    languageSlug: "python",
    project: "Data Processor",
    projectSlug: "dataprocessor",
    description: "Data processing with type hints and comprehensions",
    fileName: "processor.py",
    color: "#3572A5",
    code: `from collections import defaultdict
from typing import Any

class DataProcessor:
    def __init__(self, records: list[dict[str, Any]]) -> None:
        self.records = records
        self._cache: dict[str, list[dict]] = {}

    def group_by(self, key: str) -> dict[str, list[dict]]:
        if key in self._cache:
            return self._cache[key]
        groups: dict[str, list[dict]] = defaultdict(list)
        for record in self.records:
            value = str(record.get(key, "unknown"))
            groups[value].append(record)
        self._cache[key] = dict(groups)
        return self._cache[key]

    def aggregate(self, field: str) -> dict[str, float]:
        values = [r[field] for r in self.records if field in r]
        if not values:
            return {"min": 0.0, "max": 0.0, "avg": 0.0}
        return {
            "min": float(min(values)),
            "max": float(max(values)),
            "avg": sum(values) / len(values),
        }

    def filter_records(self, **kwargs: Any) -> list[dict]:
        result = self.records
        for key, value in kwargs.items():
            result = [r for r in result if r.get(key) == value]
        return result

    def to_summary(self) -> dict[str, int | str]:
        fields = {k for r in self.records for k in r.keys()}
        return {
            "total_records": len(self.records),
            "fields": ", ".join(sorted(fields)),
        }`,
  },
  {
    id: "rust-configparser",
    language: "Rust",
    languageSlug: "rust",
    project: "Config Parser",
    projectSlug: "configparser",
    description: "Config file parser with Result and pattern matching",
    fileName: "config.rs",
    color: "#dea584",
    code: `use std::collections::HashMap;
use std::fs;

#[derive(Debug, Clone)]
pub struct Config {
    entries: HashMap<String, String>,
    path: String,
}

#[derive(Debug)]
pub enum ConfigError {
    IoError(String),
    ParseError { line: usize, message: String },
}

impl Config {
    pub fn from_file(path: &str) -> Result<Self, ConfigError> {
        let content = fs::read_to_string(path)
            .map_err(|e| ConfigError::IoError(e.to_string()))?;
        let mut entries = HashMap::new();
        for (idx, line) in content.lines().enumerate() {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with('#') {
                continue;
            }
            match trimmed.split_once('=') {
                Some((key, value)) => {
                    entries.insert(
                        key.trim().to_string(),
                        value.trim().to_string(),
                    );
                }
                None => {
                    return Err(ConfigError::ParseError {
                        line: idx + 1,
                        message: format!("Invalid syntax: {}", trimmed),
                    });
                }
            }
        }
        Ok(Config {
            entries,
            path: path.to_string(),
        })
    }

    pub fn get(&self, key: &str) -> Option<&str> {
        self.entries.get(key).map(|v| v.as_str())
    }
}`,
  },
  {
    id: "go-httphandler",
    language: "Go",
    languageSlug: "go",
    project: "HTTP Handler",
    projectSlug: "httphandler",
    description: "HTTP handler with sync.RWMutex and JSON encoding",
    fileName: "handler.go",
    color: "#00ADD8",
    code: `package main

import (
    "encoding/json"
    "net/http"
    "sync"
)

type Item struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Price float64 \`json:"price"\`
}

type Store struct {
    mu     sync.RWMutex
    items  map[int]Item
    nextID int
}

func NewStore() *Store {
    return &Store{items: make(map[int]Item), nextID: 1}
}

func (s *Store) HandleList(w http.ResponseWriter, r *http.Request) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    result := make([]Item, 0, len(s.items))
    for _, item := range s.items {
        result = append(result, item)
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}

func (s *Store) HandleCreate(w http.ResponseWriter, r *http.Request) {
    var item Item
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    s.mu.Lock()
    item.ID = s.nextID
    s.nextID++
    s.items[item.ID] = item
    s.mu.Unlock()
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(item)
}`,
  },
  {
    id: "java-streams",
    language: "Java",
    languageSlug: "java",
    project: "Stream Processing",
    projectSlug: "streams",
    description: "Stream API with collectors and Optional",
    fileName: "Analytics.java",
    color: "#b07219",
    code: `import java.util.*;
import java.util.stream.*;

public class Analytics {
    private final List<Transaction> transactions;

    public Analytics(List<Transaction> transactions) {
        this.transactions = Collections.unmodifiableList(transactions);
    }

    public Map<String, Double> totalByCategory() {
        return transactions.stream()
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.summingDouble(Transaction::getAmount)
            ));
    }

    public Optional<Transaction> findLargest() {
        return transactions.stream()
            .max(Comparator.comparingDouble(Transaction::getAmount));
    }

    public List<String> topCategories(int limit) {
        return totalByCategory().entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .limit(limit)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    public DoubleSummaryStatistics getStats() {
        return transactions.stream()
            .mapToDouble(Transaction::getAmount)
            .summaryStatistics();
    }

    public Map<Boolean, List<Transaction>> partitionByThreshold(double threshold) {
        return transactions.stream()
            .collect(Collectors.partitioningBy(
                t -> t.getAmount() >= threshold
            ));
    }
}`,
  },
  {
    id: "c-linkedlist",
    language: "C",
    languageSlug: "c",
    project: "Linked List",
    projectSlug: "linkedlist",
    description: "Generic linked list with void pointers and function pointers",
    fileName: "list.c",
    color: "#555555",
    code: `#include <stdlib.h>
#include <string.h>

typedef struct Node {
    void *data;
    struct Node *next;
} Node;

typedef struct {
    Node *head;
    size_t length;
    size_t elem_size;
    void (*free_fn)(void *);
} LinkedList;

LinkedList *list_create(size_t elem_size, void (*free_fn)(void *)) {
    LinkedList *list = malloc(sizeof(LinkedList));
    if (!list) return NULL;
    list->head = NULL;
    list->length = 0;
    list->elem_size = elem_size;
    list->free_fn = free_fn;
    return list;
}

int list_push(LinkedList *list, const void *data) {
    Node *node = malloc(sizeof(Node));
    if (!node) return -1;
    node->data = malloc(list->elem_size);
    if (!node->data) {
        free(node);
        return -1;
    }
    memcpy(node->data, data, list->elem_size);
    node->next = list->head;
    list->head = node;
    list->length++;
    return 0;
}

void list_destroy(LinkedList *list) {
    Node *current = list->head;
    while (current != NULL) {
        Node *temp = current;
        current = current->next;
        if (list->free_fn) {
            list->free_fn(temp->data);
        } else {
            free(temp->data);
        }
        free(temp);
    }
    free(list);
}`,
  },
  {
    id: "ruby-comparableclass",
    language: "Ruby",
    languageSlug: "ruby",
    project: "Comparable Class",
    projectSlug: "comparableclass",
    description: "Class with attr_accessor, symbols, and spaceship operator",
    fileName: "product.rb",
    color: "#701516",
    code: `class Product
  include Comparable

  attr_accessor :name, :price, :category
  attr_reader :id, :created_at

  @@count = 0

  def initialize(name:, price:, category: :general)
    @@count += 1
    @id = @@count
    @name = name
    @price = price.to_f
    @category = category
    @created_at = Time.now
  end

  def <=>(other)
    @price <=> other.price
  end

  def discounted(percent)
    raise ArgumentError, "Invalid percent" unless (0..100).include?(percent)
    new_price = @price * (1 - percent / 100.0)
    self.class.new(name: @name, price: new_price, category: @category)
  end

  def to_h
    {
      id: @id,
      name: @name,
      price: @price,
      category: @category,
      created_at: @created_at.iso8601
    }
  end

  def self.total_count
    @@count
  end

  def self.bulk_discount(products, percent)
    products.map { |p| p.discounted(percent) }
  end

  def to_s
    "#<Product:#{@id} #{@name} $#{'%.2f' % @price}>"
  end
end`,
  },
  {
    id: "swift-lrucache",
    language: "Swift",
    languageSlug: "swift",
    project: "LRU Cache",
    projectSlug: "lrucache",
    description: "Protocol-oriented LRU cache with generics",
    fileName: "LRUCache.swift",
    color: "#F05138",
    code: `protocol Cacheable {
    associatedtype Key: Hashable
    associatedtype Value
    mutating func get(_ key: Key) -> Value?
    mutating func set(_ key: Key, value: Value)
    var count: Int { get }
}

struct LRUCache<K: Hashable, V>: Cacheable {
    typealias Key = K
    typealias Value = V

    private var capacity: Int
    private var storage: [K: V] = [:]
    private var order: [K] = []

    init(capacity: Int) {
        precondition(capacity > 0, "Capacity must be positive")
        self.capacity = capacity
    }

    var count: Int { storage.count }

    mutating func get(_ key: K) -> V? {
        guard let value = storage[key] else { return nil }
        moveToFront(key)
        return value
    }

    mutating func set(_ key: K, value: V) {
        if storage[key] != nil {
            storage[key] = value
            moveToFront(key)
        } else {
            if storage.count >= capacity {
                let evicted = order.removeLast()
                storage.removeValue(forKey: evicted)
            }
            storage[key] = value
            order.insert(key, at: 0)
        }
    }

    private mutating func moveToFront(_ key: K) {
        if let idx = order.firstIndex(of: key) {
            order.remove(at: idx)
            order.insert(key, at: 0)
        }
    }
}`,
  },
  {
    id: "css-dashboard",
    language: "CSS",
    languageSlug: "css",
    project: "Dashboard Layout",
    projectSlug: "dashboard",
    description: "Modern grid dashboard with custom properties",
    fileName: "dashboard.css",
    color: "#563d7c",
    code: `:root {
    --color-primary: #6366f1;
    --color-surface: #1e1e2e;
    --color-text: #cdd6f4;
    --sidebar-width: 260px;
    --radius: 8px;
    --gap: 1.5rem;
}

.dashboard {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    grid-template-rows: 64px 1fr;
    min-height: 100vh;
    background: var(--color-surface);
    color: var(--color-text);
}

.dashboard__sidebar {
    grid-row: 1 / -1;
    padding: var(--gap);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.dashboard__main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--gap);
    padding: var(--gap);
    align-content: start;
}

.card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius);
    padding: 1.25rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
    .dashboard__sidebar {
        grid-row: auto;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
}`,
  },
  {
    id: "kotlin-taskmanager",
    language: "Kotlin",
    languageSlug: "kotlin",
    project: "Task Manager",
    projectSlug: "taskmanager",
    description: "Data classes, enum, and functional operations",
    fileName: "TaskManager.kt",
    color: "#A97BFF",
    code: `enum class Priority { LOW, MEDIUM, HIGH, CRITICAL }

data class Task(
    val id: Int,
    val title: String,
    val priority: Priority = Priority.MEDIUM,
    val completed: Boolean = false,
    val tags: List<String> = emptyList()
)

class TaskManager {
    private val tasks = mutableListOf<Task>()
    private var nextId = 1

    fun add(title: String, priority: Priority = Priority.MEDIUM, tags: List<String> = emptyList()): Task {
        val task = Task(id = nextId++, title = title, priority = priority, tags = tags)
        tasks.add(task)
        return task
    }

    fun complete(id: Int): Boolean {
        val index = tasks.indexOfFirst { it.id == id }
        if (index == -1) return false
        tasks[index] = tasks[index].copy(completed = true)
        return true
    }

    fun byPriority(): Map<Priority, List<Task>> =
        tasks.groupBy { it.priority }
            .toSortedMap(compareByDescending { it.ordinal })

    fun search(query: String): List<Task> =
        tasks.filter { task ->
            task.title.contains(query, ignoreCase = true) ||
                task.tags.any { it.contains(query, ignoreCase = true) }
        }

    fun stats(): Map<String, Any> = mapOf(
        "total" to tasks.size,
        "completed" to tasks.count { it.completed },
        "pending" to tasks.count { !it.completed },
        "byPriority" to Priority.entries.associate { p ->
            p.name to tasks.count { it.priority == p }
        }
    )
}`,
  },
  {
    id: "php-cachemanager",
    language: "PHP",
    languageSlug: "php",
    project: "Cache Manager",
    projectSlug: "cachemanager",
    description: "Strict-typed cache manager with constructor promotion",
    fileName: "CacheManager.php",
    color: "#4F5D95",
    code: `<?php

declare(strict_types=1);

readonly class CacheEntry
{
    public function __construct(
        public mixed $value,
        public int $expiresAt,
        public int $hits = 0,
    ) {}

    public function isExpired(): bool
    {
        return time() > $this->expiresAt;
    }
}

class CacheManager
{
    /** @var array<string, CacheEntry> */
    private array $store = [];
    private int $defaultTtl;

    public function __construct(
        private readonly int $maxSize = 1000,
        int $ttl = 3600,
    ) {
        $this->defaultTtl = $ttl;
    }

    public function get(string $key, mixed $default = null): mixed
    {
        if (!isset($this->store[$key])) {
            return $default;
        }
        $entry = $this->store[$key];
        if ($entry->isExpired()) {
            unset($this->store[$key]);
            return $default;
        }
        $this->store[$key] = new CacheEntry(
            value: $entry->value,
            expiresAt: $entry->expiresAt,
            hits: $entry->hits + 1,
        );
        return $entry->value;
    }

    public function set(string $key, mixed $value, ?int $ttl = null): void
    {
        if (count($this->store) >= $this->maxSize) {
            $this->evictExpired();
        }
        $this->store[$key] = new CacheEntry(
            value: $value,
            expiresAt: time() + ($ttl ?? $this->defaultTtl),
        );
    }

    private function evictExpired(): void
    {
        $this->store = array_filter(
            $this->store,
            fn(CacheEntry $e) => !$e->isExpired(),
        );
    }
}`,
  },
];

export function getLessonBySlug(
  lang: string,
  project: string
): Lesson | undefined {
  return lessons.find(
    (l) => l.languageSlug === lang && l.projectSlug === project
  );
}

export function getLessonsByLanguage(): Record<string, Lesson[]> {
  const grouped: Record<string, Lesson[]> = {};
  for (const lesson of lessons) {
    if (!grouped[lesson.language]) {
      grouped[lesson.language] = [];
    }
    grouped[lesson.language].push(lesson);
  }
  return grouped;
}
