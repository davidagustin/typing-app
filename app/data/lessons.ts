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
  {
    id: "cpp-smartpointers",
    language: "C++",
    languageSlug: "cpp",
    project: "Smart Pointers",
    projectSlug: "smartpointers",
    description: "Modern C++17 with smart pointers and RAII",
    fileName: "main.cpp",
    color: "#f34b7d",
    code: `#include <memory>
#include <vector>
#include <string>
#include <algorithm>
#include <optional>

struct Sensor {
    std::string name;
    double value;
    bool active;
};

class SensorNetwork {
    std::vector<std::unique_ptr<Sensor>> sensors_;

public:
    void add(std::string name, double initial) {
        auto sensor = std::make_unique<Sensor>(
            Sensor{std::move(name), initial, true}
        );
        sensors_.push_back(std::move(sensor));
    }

    std::optional<double> read(const std::string& name) const {
        auto it = std::find_if(
            sensors_.begin(), sensors_.end(),
            [&name](const auto& s) {
                return s->name == name && s->active;
            }
        );
        if (it != sensors_.end()) {
            return (*it)->value;
        }
        return std::nullopt;
    }

    void update(const std::string& name, double val) {
        for (auto& sensor : sensors_) {
            if (sensor->name == name) {
                sensor->value = val;
                return;
            }
        }
    }

    std::vector<std::string> active_names() const {
        std::vector<std::string> result;
        for (const auto& s : sensors_) {
            if (s->active) {
                result.push_back(s->name);
            }
        }
        return result;
    }

    size_t count() const { return sensors_.size(); }

    void deactivate(const std::string& name) {
        for (auto& sensor : sensors_) {
            if (sensor->name == name) {
                sensor->active = false;
                return;
            }
        }
    }
};`,
  },
  {
    id: "csharp-recordslinq",
    language: "C#",
    languageSlug: "csharp",
    project: "Records and LINQ",
    projectSlug: "recordslinq",
    description: "C# records, LINQ queries, and async/await",
    fileName: "OrderService.cs",
    color: "#178600",
    code: `using System.Collections.Concurrent;

public record Product(string Name, decimal Price, string Category);

public record OrderLine(Product Product, int Quantity)
{
    public decimal Total => Product.Price * Quantity;
}

public record Order(
    Guid Id,
    DateTime CreatedAt,
    List<OrderLine> Lines
)
{
    public decimal GrandTotal => Lines.Sum(l => l.Total);
}

public class OrderService
{
    private readonly ConcurrentDictionary<Guid, Order> _orders = new();

    public async Task<Order> CreateOrderAsync(
        List<OrderLine> lines)
    {
        await Task.Delay(10);
        var order = new Order(
            Guid.NewGuid(),
            DateTime.UtcNow,
            lines
        );
        _orders.TryAdd(order.Id, order);
        return order;
    }

    public IEnumerable<Order> GetByCategory(string category)
    {
        return _orders.Values
            .Where(o => o.Lines.Any(
                l => l.Product.Category == category))
            .OrderByDescending(o => o.GrandTotal);
    }

    public Dictionary<string, decimal> RevenueByCategory()
    {
        return _orders.Values
            .SelectMany(o => o.Lines)
            .GroupBy(l => l.Product.Category)
            .ToDictionary(
                g => g.Key,
                g => g.Sum(l => l.Total)
            );
    }

    public decimal AverageOrderValue()
    {
        if (_orders.IsEmpty) return 0m;
        return _orders.Values.Average(o => o.GrandTotal);
    }
}`,
  },
  {
    id: "scala-patternmatching",
    language: "Scala",
    languageSlug: "scala",
    project: "Pattern Matching",
    projectSlug: "patternmatching",
    description: "Case classes, sealed traits, and functional patterns",
    fileName: "Evaluator.scala",
    color: "#c22d40",
    code: `sealed trait Expr
case class Num(value: Double) extends Expr
case class Add(left: Expr, right: Expr) extends Expr
case class Mul(left: Expr, right: Expr) extends Expr
case class Var(name: String) extends Expr
case class Let(name: String, value: Expr, body: Expr) extends Expr

object Evaluator {
  type Env = Map[String, Double]

  def eval(expr: Expr, env: Env = Map.empty): Double =
    expr match {
      case Num(v) => v
      case Add(l, r) => eval(l, env) + eval(r, env)
      case Mul(l, r) => eval(l, env) * eval(r, env)
      case Var(name) => env.getOrElse(name,
        throw new RuntimeException(
          s"Undefined variable: \$name"
        ))
      case Let(name, value, body) =>
        val v = eval(value, env)
        eval(body, env + (name -> v))
    }

  def simplify(expr: Expr): Expr = expr match {
    case Add(Num(0), r) => simplify(r)
    case Add(l, Num(0)) => simplify(l)
    case Mul(Num(1), r) => simplify(r)
    case Mul(l, Num(1)) => simplify(l)
    case Mul(Num(0), _) => Num(0)
    case Mul(_, Num(0)) => Num(0)
    case Add(l, r) => Add(simplify(l), simplify(r))
    case Mul(l, r) => Mul(simplify(l), simplify(r))
    case other => other
  }

  def variables(expr: Expr): Set[String] = expr match {
    case Num(_) => Set.empty
    case Var(name) => Set(name)
    case Add(l, r) => variables(l) ++ variables(r)
    case Mul(l, r) => variables(l) ++ variables(r)
    case Let(n, v, b) => variables(v) ++ (variables(b) - n)
  }

  def substitute(
    expr: Expr,
    name: String,
    replacement: Expr
  ): Expr = expr match {
    case Var(n) if n == name => replacement
    case Add(l, r) =>
      Add(substitute(l, name, replacement),
          substitute(r, name, replacement))
    case Mul(l, r) =>
      Mul(substitute(l, name, replacement),
          substitute(r, name, replacement))
    case other => other
  }
}`,
  },
  {
    id: "haskell-typeclasses",
    language: "Haskell",
    languageSlug: "haskell",
    project: "Type Classes",
    projectSlug: "typeclasses",
    description: "Type classes, monads, and pure functional programming",
    fileName: "Validation.hs",
    color: "#5e5086",
    code: `module Validation where

data Validation e a
  = Failure [e]
  | Success a
  deriving (Show, Eq)

instance Functor (Validation e) where
  fmap _ (Failure es) = Failure es
  fmap f (Success a)  = Success (f a)

instance Semigroup (Validation e a) where
  Failure e1 <> Failure e2 = Failure (e1 <> e2)
  Failure e1 <> _          = Failure e1
  _          <> Failure e2 = Failure e2
  Success a  <> _          = Success a

validate :: (a -> Bool) -> e -> a -> Validation e a
validate predicate err value
  | predicate value = Success value
  | otherwise       = Failure [err]

data User = User
  { userName  :: String
  , userEmail :: String
  , userAge   :: Int
  } deriving (Show)

nonEmpty :: String -> String -> Validation String String
nonEmpty field value =
  validate (not . null) (field ++ " must not be empty") value

validAge :: Int -> Validation String Int
validAge =
  validate (\\a -> a >= 0 && a <= 150) "Age must be 0-150"

validEmail :: String -> Validation String String
validEmail =
  validate (elem '@') "Email must contain @"

mkUser :: String -> String -> Int -> Validation String User
mkUser name email age =
  case (nonEmpty "Name" name, validEmail email, validAge age) of
    (Success n, Success e, Success a) ->
      Success (User n e a)
    (n, e, a) ->
      Failure (getErrors n ++ getErrors e ++ getErrors a)
  where
    getErrors (Failure es) = es
    getErrors _            = []

mapValidation :: (a -> b) -> Validation e a -> Validation e b
mapValidation = fmap

bindValidation :: Validation e a
               -> (a -> Validation e b)
               -> Validation e b
bindValidation (Failure es) _ = Failure es
bindValidation (Success a)  f = f a`,
  },
  {
    id: "lua-metatables",
    language: "Lua",
    languageSlug: "lua",
    project: "Metatables",
    projectSlug: "metatables",
    description: "Tables, metatables, and coroutine-based iteration",
    fileName: "vector.lua",
    color: "#000080",
    code: `local Vector = {}
Vector.__index = Vector

function Vector.new(x, y, z)
    local self = setmetatable({}, Vector)
    self.x = x or 0
    self.y = y or 0
    self.z = z or 0
    return self
end

function Vector.__add(a, b)
    return Vector.new(a.x + b.x, a.y + b.y, a.z + b.z)
end

function Vector.__sub(a, b)
    return Vector.new(a.x - b.x, a.y - b.y, a.z - b.z)
end

function Vector.__mul(a, b)
    if type(a) == "number" then
        return Vector.new(a * b.x, a * b.y, a * b.z)
    elseif type(b) == "number" then
        return Vector.new(a.x * b, a.y * b, a.z * b)
    end
    return a.x * b.x + a.y * b.y + a.z * b.z
end

function Vector:magnitude()
    return math.sqrt(self.x^2 + self.y^2 + self.z^2)
end

function Vector:normalized()
    local mag = self:magnitude()
    if mag == 0 then return Vector.new() end
    return Vector.new(self.x / mag, self.y / mag, self.z / mag)
end

function Vector:cross(other)
    return Vector.new(
        self.y * other.z - self.z * other.y,
        self.z * other.x - self.x * other.z,
        self.x * other.y - self.y * other.x
    )
end

function Vector.__tostring(v)
    return string.format("(%g, %g, %g)", v.x, v.y, v.z)
end

function Vector.__eq(a, b)
    return a.x == b.x and a.y == b.y and a.z == b.z
end

function Vector.lerp(a, b, t)
    t = math.max(0, math.min(1, t))
    return a + (b - a) * t
end

return Vector`,
  },
  {
    id: "r-dataanalysis",
    language: "R",
    languageSlug: "r",
    project: "Data Analysis",
    projectSlug: "dataanalysis",
    description: "Data frames, statistical analysis, and functional style",
    fileName: "analysis.R",
    color: "#198ce7",
    code: `summarize_dataset <- function(df) {
    numeric_cols <- sapply(df, is.numeric)
    stats <- lapply(df[, numeric_cols, drop = FALSE], function(col) {
        list(
            mean = mean(col, na.rm = TRUE),
            median = median(col, na.rm = TRUE),
            sd = sd(col, na.rm = TRUE),
            missing = sum(is.na(col))
        )
    })
    do.call(rbind, lapply(stats, as.data.frame))
}

normalize <- function(x) {
    rng <- range(x, na.rm = TRUE)
    (x - rng[1]) / (rng[2] - rng[1])
}

detect_outliers <- function(df, col, threshold = 1.5) {
    values <- df[[col]]
    q1 <- quantile(values, 0.25, na.rm = TRUE)
    q3 <- quantile(values, 0.75, na.rm = TRUE)
    iqr <- q3 - q1
    lower <- q1 - threshold * iqr
    upper <- q3 + threshold * iqr
    df[values < lower | values > upper, ]
}

pivot_summary <- function(df, group_col, value_col) {
    groups <- split(df[[value_col]], df[[group_col]])
    result <- data.frame(
        group = names(groups),
        count = sapply(groups, length),
        mean = sapply(groups, mean, na.rm = TRUE),
        total = sapply(groups, sum, na.rm = TRUE),
        row.names = NULL
    )
    result[order(-result$total), ]
}

correlation_matrix <- function(df) {
    numeric_df <- df[, sapply(df, is.numeric)]
    cor_mat <- cor(numeric_df, use = "pairwise.complete.obs")
    round(cor_mat, 3)
}

bootstrap_mean <- function(x, n_boot = 1000) {
    means <- replicate(n_boot, {
        sample_data <- sample(x, length(x), replace = TRUE)
        mean(sample_data)
    })
    list(
        estimate = mean(means),
        ci_lower = quantile(means, 0.025),
        ci_upper = quantile(means, 0.975)
    )
}`,
  },
  {
    id: "perl-textprocessor",
    language: "Perl",
    languageSlug: "perl",
    project: "Text Processor",
    projectSlug: "textprocessor",
    description: "Regex, file processing, and hash operations",
    fileName: "processor.pl",
    color: "#0298c3",
    code: `use strict;
use warnings;

sub parse_log_entries {
    my ($filename) = @_;
    my %stats;
    open(my $fh, '<', $filename) or die "Cannot open: $!";
    while (my $line = <$fh>) {
        chomp $line;
        if ($line =~ /^(\\d{4}-\\d{2}-\\d{2})\\s+(\\w+)\\s+(.+)/) {
            my ($date, $level, $message) = ($1, $2, $3);
            $stats{$level} //= [];
            push @{$stats{$level}}, {
                date    => $date,
                message => $message,
            };
        }
    }
    close $fh;
    return \\%stats;
}

sub extract_fields {
    my ($text, @patterns) = @_;
    my %results;
    for my $pattern (@patterns) {
        my @matches = ($text =~ /$pattern/g);
        $results{$pattern} = \\@matches;
    }
    return %results;
}

sub word_frequency {
    my ($text) = @_;
    my %freq;
    $text = lc $text;
    $text =~ s/[^a-z0-9\\s]//g;
    $freq{$_}++ for split /\\s+/, $text;
    my @sorted = sort { $freq{$b} <=> $freq{$a} } keys %freq;
    return map { [$_, $freq{$_}] } @sorted;
}

sub transform_csv {
    my ($input, $output, $transform) = @_;
    open(my $in, '<', $input) or die "Read error: $!";
    open(my $out, '>', $output) or die "Write error: $!";
    my $header = <$in>;
    chomp $header;
    my @fields = split /,/, $header;
    print $out join(",", @fields) . "\\n";
    while (my $line = <$in>) {
        chomp $line;
        my %row;
        @row{@fields} = split /,/, $line;
        my %transformed = $transform->(\\%row);
        print $out join(",", @transformed{@fields}) . "\\n";
    }
    close $in;
    close $out;
}`,
  },
  {
    id: "bash-processmanager",
    language: "Bash",
    languageSlug: "bash",
    project: "Process Manager",
    projectSlug: "processmanager",
    description: "Shell scripting with arrays, functions, and process control",
    fileName: "manager.sh",
    color: "#89e051",
    code: `#!/usr/bin/env bash
set -euo pipefail

declare -A SERVICES
LOG_DIR="/var/log/svcmanager"

init_service() {
    local name="\$1"
    local command="\$2"
    SERVICES["$name"]="stopped"
    mkdir -p "\${LOG_DIR}"
}

start_service() {
    local name="\$1"
    local command="\$2"
    if [[ "\${SERVICES[$name]:-}" == "running" ]]; then
        printf "Service %s is already running\\n" "\$name"
        return 1
    fi
    nohup \$command > "\${LOG_DIR}/\${name}.log" 2>&1 &
    local pid=\$!
    SERVICES["\$name"]="running"
    printf "%d" "\$pid" > "\${LOG_DIR}/\${name}.pid"
    printf "Started %s with PID %d\\n" "\$name" "\$pid"
}

stop_service() {
    local name="\$1"
    local pidfile="\${LOG_DIR}/\${name}.pid"
    if [[ ! -f "\$pidfile" ]]; then
        printf "No PID file for %s\\n" "\$name"
        return 1
    fi
    local pid
    pid=\$(< "\$pidfile")
    if kill -0 "\$pid" 2>/dev/null; then
        kill -TERM "\$pid"
        local count=0
        while kill -0 "\$pid" 2>/dev/null; do
            sleep 1
            (( count++ ))
            if (( count >= 10 )); then
                kill -9 "\$pid"
                break
            fi
        done
    fi
    rm -f "\$pidfile"
    SERVICES["\$name"]="stopped"
    printf "Stopped %s\\n" "\$name"
}

list_services() {
    printf "%-20s %s\\n" "SERVICE" "STATUS"
    printf "%-20s %s\\n" "-------" "------"
    for name in "\${!SERVICES[@]}"; do
        printf "%-20s %s\\n" "\$name" "\${SERVICES[\$name]}"
    done
}

health_check() {
    local failures=0
    for name in "\${!SERVICES[@]}"; do
        local pidfile="\${LOG_DIR}/\${name}.pid"
        if [[ "\${SERVICES[\$name]}" == "running" ]]; then
            if [[ -f "\$pidfile" ]]; then
                local pid
                pid=\$(< "\$pidfile")
                if ! kill -0 "\$pid" 2>/dev/null; then
                    SERVICES["\$name"]="crashed"
                    (( failures++ ))
                fi
            fi
        fi
    done
    return "\$failures"
}`,
  },
  {
    id: "powershell-pipeline",
    language: "PowerShell",
    languageSlug: "powershell",
    project: "Pipeline Operations",
    projectSlug: "pipeline",
    description: "Cmdlet-style functions with pipeline and objects",
    fileName: "FileAudit.ps1",
    color: "#012456",
    code: `function Get-FileAudit {
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [int]$DaysOld = 30,
        [string[]]$Extension = @("*")
    )

    $cutoff = (Get-Date).AddDays(-$DaysOld)

    Get-ChildItem -Path $Path -Recurse -File |
        Where-Object {
            $ext = $_.Extension.TrimStart(".")
            ($Extension -contains "*") -or
            ($Extension -contains $ext)
        } |
        Select-Object @{
            Name = "RelativePath"
            Expression = {
                $_.FullName.Replace($Path, ".")
            }
        }, @{
            Name = "SizeKB"
            Expression = {
                [math]::Round($_.Length / 1KB, 2)
            }
        }, LastWriteTime, Extension |
        Sort-Object SizeKB -Descending
}

function Get-DuplicateFiles {
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    $hashes = @{}
    Get-ChildItem -Path $Path -Recurse -File |
        ForEach-Object {
            $hash = (Get-FileHash $_.FullName -Algorithm MD5).Hash
            if ($hashes.ContainsKey($hash)) {
                $hashes[$hash] += @($_.FullName)
            } else {
                $hashes[$hash] = @($_.FullName)
            }
        }

    $hashes.GetEnumerator() |
        Where-Object { $_.Value.Count -gt 1 } |
        ForEach-Object {
            [PSCustomObject]@{
                Hash  = $_.Key
                Count = $_.Value.Count
                Files = $_.Value
                Size  = (Get-Item $_.Value[0]).Length
            }
        } |
        Sort-Object Size -Descending
}

function Compress-OldFiles {
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [int]$DaysOld = 90,
        [string]$ArchivePath
    )

    $oldFiles = Get-FileAudit -Path $Path -DaysOld $DaysOld
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $zipPath = Join-Path $ArchivePath "archive_$timestamp.zip"

    $oldFiles |
        Select-Object -ExpandProperty RelativePath |
        Compress-Archive -DestinationPath $zipPath

    [PSCustomObject]@{
        Archive    = $zipPath
        FileCount  = $oldFiles.Count
        TotalSizeKB = ($oldFiles | Measure-Object SizeKB -Sum).Sum
    }
}`,
  },
  {
    id: "dart-flutterwidget",
    language: "Dart",
    languageSlug: "dart",
    project: "Flutter Widget",
    projectSlug: "flutterwidget",
    description: "Flutter-style classes with async/await and streams",
    fileName: "task_store.dart",
    color: "#00b4ab",
    code: `import 'dart:async';

enum Priority { low, medium, high, urgent }

class Task {
  final String id;
  final String title;
  final Priority priority;
  bool completed;
  final DateTime createdAt;

  Task({
    required this.id,
    required this.title,
    this.priority = Priority.medium,
    this.completed = false,
  }) : createdAt = DateTime.now();

  Task copyWith({
    String? title,
    Priority? priority,
    bool? completed,
  }) {
    return Task(
      id: id,
      title: title ?? this.title,
      priority: priority ?? this.priority,
      completed: completed ?? this.completed,
    );
  }
}

class TaskStore {
  final Map<String, Task> _tasks = {};
  final _controller = StreamController<List<Task>>.broadcast();
  int _nextId = 1;

  Stream<List<Task>> get stream => _controller.stream;

  List<Task> get all => _tasks.values.toList()
    ..sort((a, b) =>
        b.priority.index.compareTo(a.priority.index));

  void add(String title, {Priority priority = Priority.medium}) {
    final id = 'task_\${_nextId++}';
    _tasks[id] = Task(
      id: id,
      title: title,
      priority: priority,
    );
    _notify();
  }

  void toggle(String id) {
    final task = _tasks[id];
    if (task != null) {
      _tasks[id] = task.copyWith(completed: !task.completed);
      _notify();
    }
  }

  Future<List<Task>> search(String query) async {
    await Future.delayed(Duration(milliseconds: 50));
    final lower = query.toLowerCase();
    return all
        .where((t) => t.title.toLowerCase().contains(lower))
        .toList();
  }

  Map<Priority, int> countByPriority() {
    return {
      for (var p in Priority.values)
        p: all.where((t) => t.priority == p).length,
    };
  }

  void _notify() => _controller.add(all);

  void dispose() => _controller.close();
}`,
  },
  {
    id: "elixir-genserver",
    language: "Elixir",
    languageSlug: "elixir",
    project: "GenServer",
    projectSlug: "genserver",
    description: "GenServer with pattern matching and pipe operator",
    fileName: "cache.ex",
    color: "#6e4a7e",
    code: `defmodule Cache do
  use GenServer

  defstruct entries: %{}, max_size: 100

  def start_link(opts \\\\ []) do
    max_size = Keyword.get(opts, :max_size, 100)
    GenServer.start_link(__MODULE__, max_size, name: __MODULE__)
  end

  def get(key), do: GenServer.call(__MODULE__, {:get, key})
  def put(key, value), do: GenServer.cast(__MODULE__, {:put, key, value})
  def delete(key), do: GenServer.cast(__MODULE__, {:delete, key})
  def stats, do: GenServer.call(__MODULE__, :stats)

  @impl true
  def init(max_size) do
    {:ok, %__MODULE__{max_size: max_size}}
  end

  @impl true
  def handle_call({:get, key}, _from, state) do
    result = Map.get(state.entries, key)
    {:reply, result, state}
  end

  def handle_call(:stats, _from, state) do
    stats =
      state.entries
      |> Map.values()
      |> Enum.reduce(%{types: %{}, count: 0}, fn val, acc ->
        type = val |> inspect() |> String.split("(") |> hd()
        types = Map.update(acc.types, type, 1, &(&1 + 1))
        %{acc | types: types, count: acc.count + 1}
      end)

    {:reply, stats, state}
  end

  @impl true
  def handle_cast({:put, key, value}, state) do
    entries =
      if map_size(state.entries) >= state.max_size do
        state.entries
        |> Map.keys()
        |> hd()
        |> then(&Map.delete(state.entries, &1))
      else
        state.entries
      end

    {:noreply, %{state | entries: Map.put(entries, key, value)}}
  end

  def handle_cast({:delete, key}, state) do
    {:noreply, %{state | entries: Map.delete(state.entries, key)}}
  end

  def transform_all(func) do
    GenServer.call(__MODULE__, {:transform, func})
  end

  @impl true
  def handle_call({:transform, func}, _from, state) do
    new_entries =
      state.entries
      |> Enum.map(fn {k, v} -> {k, func.(v)} end)
      |> Map.new()

    {:reply, :ok, %{state | entries: new_entries}}
  end
end`,
  },
  {
    id: "clojure-datastructures",
    language: "Clojure",
    languageSlug: "clojure",
    project: "Data Structures",
    projectSlug: "datastructures",
    description: "Persistent data structures and threading macros",
    fileName: "inventory.clj",
    color: "#db5855",
    code: `(ns inventory.core)

(defn create-store []
  (atom {:products {}
         :categories #{}
         :next-id 1}))

(defn add-product [store product]
  (let [id (:next-id @store)]
    (swap! store
      (fn [state]
        (-> state
            (assoc-in [:products id]
              (assoc product :id id))
            (update :categories conj (:category product))
            (update :next-id inc))))
    id))

(defn find-products [store pred]
  (->> @store
       :products
       vals
       (filter pred)
       (sort-by :name)))

(defn by-category [store category]
  (find-products store
    #(= (:category %) category)))

(defn update-price [store id modifier]
  (swap! store
    update-in [:products id :price] modifier))

(defn price-stats [store]
  (let [prices (->> @store
                    :products
                    vals
                    (map :price))]
    (when (seq prices)
      {:min (apply min prices)
       :max (apply max prices)
       :avg (/ (reduce + prices) (count prices))
       :count (count prices)})))

(defn apply-discount [store category percent]
  (let [factor (- 1.0 (/ percent 100.0))
        products (by-category store category)]
    (doseq [product products]
      (update-price store (:id product)
        #(* % factor)))
    (count products)))

(defn inventory-report [store]
  (let [products (vals (:products @store))]
    (->> products
         (group-by :category)
         (map (fn [[cat items]]
                {:category cat
                 :count (count items)
                 :total-value (->> items
                                   (map :price)
                                   (reduce +))
                 :avg-price (/ (->> items
                                    (map :price)
                                    (reduce +))
                               (count items))}))
         (sort-by :total-value >))))`,
  },
  {
    id: "fsharp-railwayprogramming",
    language: "F#",
    languageSlug: "fsharp",
    project: "Railway Programming",
    projectSlug: "railwayprogramming",
    description: "Discriminated unions and railway-oriented programming",
    fileName: "Validation.fs",
    color: "#b845fc",
    code: `module Validation

type ValidationError =
    | Required of field: string
    | TooShort of field: string * minLen: int
    | TooLong of field: string * maxLen: int
    | InvalidFormat of field: string * expected: string

type Result<'a> =
    | Ok of 'a
    | Error of ValidationError list

let bind f result =
    match result with
    | Ok value -> f value
    | Error errors -> Error errors

let map f result =
    match result with
    | Ok value -> Ok (f value)
    | Error errors -> Error errors

let combine results =
    results
    |> List.fold (fun acc r ->
        match acc, r with
        | Ok values, Ok v -> Ok (values @ [v])
        | Error e1, Error e2 -> Error (e1 @ e2)
        | Error e, _ -> Error e
        | _, Error e -> Error e
    ) (Ok [])

type UserInput = {
    Name: string
    Email: string
    Age: int
}

type ValidUser = {
    Name: string
    Email: string
    Age: int
}

let validateName input =
    if System.String.IsNullOrEmpty input.Name then
        Error [Required "Name"]
    elif input.Name.Length < 2 then
        Error [TooShort ("Name", 2)]
    elif input.Name.Length > 50 then
        Error [TooLong ("Name", 50)]
    else Ok input.Name

let validateEmail input =
    if System.String.IsNullOrEmpty input.Email then
        Error [Required "Email"]
    elif not (input.Email.Contains "@") then
        Error [InvalidFormat ("Email", "must contain @")]
    else Ok input.Email

let validateAge input =
    if input.Age < 0 || input.Age > 150 then
        Error [InvalidFormat ("Age", "must be 0-150")]
    else Ok input.Age

let validateUser input =
    match validateName input, validateEmail input, validateAge input with
    | Ok n, Ok e, Ok a ->
        Ok { Name = n; Email = e; Age = a }
    | r1, r2, r3 ->
        let errors =
            [r1; r2; r3]
            |> List.collect (fun r ->
                match r with
                | Error es -> es
                | _ -> [])
        Error errors`,
  },
  {
    id: "ocaml-modules",
    language: "OCaml",
    languageSlug: "ocaml",
    project: "Modules",
    projectSlug: "modules",
    description: "Pattern matching, modules, and variant types",
    fileName: "json_parser.ml",
    color: "#3be133",
    code: `type json =
  | Null
  | Bool of bool
  | Int of int
  | Float of float
  | String of string
  | Array of json list
  | Object of (string * json) list

let rec to_string = function
  | Null -> "null"
  | Bool b -> string_of_bool b
  | Int n -> string_of_int n
  | Float f -> Printf.sprintf "%g" f
  | String s -> Printf.sprintf "\\"%s\\"" s
  | Array items ->
    let inner =
      items
      |> List.map to_string
      |> String.concat ", "
    in
    Printf.sprintf "[%s]" inner
  | Object pairs ->
    let inner =
      pairs
      |> List.map (fun (k, v) ->
        Printf.sprintf "\\"%s\\": %s" k (to_string v))
      |> String.concat ", "
    in
    Printf.sprintf "{%s}" inner

let rec get_path json path =
  match json, path with
  | _, [] -> Some json
  | Object pairs, key :: rest ->
    (match List.assoc_opt key pairs with
     | Some child -> get_path child rest
     | None -> None)
  | Array items, idx :: rest ->
    (match int_of_string_opt idx with
     | Some i when i >= 0 && i < List.length items ->
       get_path (List.nth items i) rest
     | _ -> None)
  | _ -> None

let rec map_strings f = function
  | String s -> String (f s)
  | Array items -> Array (List.map (map_strings f) items)
  | Object pairs ->
    Object (List.map (fun (k, v) -> (k, map_strings f v)) pairs)
  | other -> other

let rec fold_values f acc = function
  | Array items ->
    List.fold_left (fold_values f) acc items
  | Object pairs ->
    List.fold_left (fun a (_, v) -> fold_values f a v) acc pairs
  | value -> f acc value

let count_strings json =
  fold_values
    (fun count v ->
      match v with String _ -> count + 1 | _ -> count)
    0 json

let merge a b =
  match a, b with
  | Object pa, Object pb ->
    let merged =
      List.fold_left
        (fun acc (k, v) ->
          if List.mem_assoc k acc then acc
          else (k, v) :: acc)
        pa pb
    in
    Object merged
  | _ -> b`,
  },
  {
    id: "julia-multipledispatch",
    language: "Julia",
    languageSlug: "julia",
    project: "Multiple Dispatch",
    projectSlug: "multipledispatch",
    description: "Multiple dispatch, array comprehensions, and broadcasting",
    fileName: "linalg.jl",
    color: "#9558b2",
    code: `abstract type Shape end

struct Circle <: Shape
    radius::Float64
end

struct Rectangle <: Shape
    width::Float64
    height::Float64
end

struct Triangle <: Shape
    a::Float64
    b::Float64
    c::Float64
end

area(c::Circle) = pi * c.radius^2
area(r::Rectangle) = r.width * r.height
function area(t::Triangle)
    s = perimeter(t) / 2
    sqrt(s * (s - t.a) * (s - t.b) * (s - t.c))
end

perimeter(c::Circle) = 2 * pi * c.radius
perimeter(r::Rectangle) = 2 * (r.width + r.height)
perimeter(t::Triangle) = t.a + t.b + t.c

function scale(c::Circle, factor::Float64)
    Circle(c.radius * factor)
end

function scale(r::Rectangle, factor::Float64)
    Rectangle(r.width * factor, r.height * factor)
end

function total_area(shapes::Vector{<:Shape})
    sum(area.(shapes))
end

function largest(shapes::Vector{<:Shape})
    areas = area.(shapes)
    idx = argmax(areas)
    shapes[idx]
end

function filter_by_area(
    shapes::Vector{<:Shape},
    min_area::Float64,
    max_area::Float64
)
    [s for s in shapes if min_area <= area(s) <= max_area]
end

function stats(shapes::Vector{<:Shape})
    areas = area.(shapes)
    Dict(
        "count" => length(shapes),
        "total_area" => sum(areas),
        "mean_area" => sum(areas) / length(areas),
        "min_area" => minimum(areas),
        "max_area" => maximum(areas),
        "std_area" => std(areas)
    )
end

function transform_all(
    shapes::Vector{<:Shape},
    f::Function
)
    [f(s) for s in shapes]
end`,
  },
  {
    id: "zig-errorhandling",
    language: "Zig",
    languageSlug: "zig",
    project: "Error Handling",
    projectSlug: "errorhandling",
    description: "Comptime, error unions, and safety features",
    fileName: "pool.zig",
    color: "#ec915c",
    code: `const std = @import("std");
const Allocator = std.mem.Allocator;

pub fn Pool(comptime T: type) type {
    return struct {
        const Self = @This();

        items: []T,
        available: []bool,
        allocator: Allocator,
        capacity: usize,

        pub fn init(
            allocator: Allocator,
            capacity: usize,
        ) !Self {
            const items = try allocator.alloc(T, capacity);
            const available = try allocator.alloc(
                bool, capacity,
            );
            @memset(available, true);
            return Self{
                .items = items,
                .available = available,
                .allocator = allocator,
                .capacity = capacity,
            };
        }

        pub fn deinit(self: *Self) void {
            self.allocator.free(self.items);
            self.allocator.free(self.available);
        }

        pub fn acquire(self: *Self) !*T {
            for (self.available, 0..) |*slot, i| {
                if (slot.*) {
                    slot.* = false;
                    return &self.items[i];
                }
            }
            return error.PoolExhausted;
        }

        pub fn release(self: *Self, ptr: *T) void {
            const addr = @intFromPtr(ptr);
            const base = @intFromPtr(self.items.ptr);
            const size = @sizeOf(T);
            if (addr >= base and
                addr < base + self.capacity * size)
            {
                const index = (addr - base) / size;
                self.available[index] = true;
            }
        }

        pub fn activeCount(self: *const Self) usize {
            var count: usize = 0;
            for (self.available) |free| {
                if (!free) count += 1;
            }
            return count;
        }

        pub fn availableCount(self: *const Self) usize {
            return self.capacity - self.activeCount();
        }
    };
}`,
  },
  {
    id: "nim-metaprogramming",
    language: "Nim",
    languageSlug: "nim",
    project: "Metaprogramming",
    projectSlug: "metaprogramming",
    description: "Templates, pragmas, and metaprogramming features",
    fileName: "collections.nim",
    color: "#ffc200",
    code: `import std/[tables, strutils, sequtils, algorithm]

type
  Priority = enum
    pLow = "low"
    pMedium = "medium"
    pHigh = "high"

  Task = object
    id: int
    title: string
    priority: Priority
    done: bool

  TaskManager = object
    tasks: seq[Task]
    index: Table[int, int]
    nextId: int

proc newTaskManager(): TaskManager =
  result.tasks = @[]
  result.index = initTable[int, int]()
  result.nextId = 1

proc add(tm: var TaskManager, title: string,
         priority = pMedium): int =
  let id = tm.nextId
  inc tm.nextId
  let task = Task(
    id: id,
    title: title,
    priority: priority,
    done: false
  )
  tm.index[id] = tm.tasks.len
  tm.tasks.add(task)
  return id

proc complete(tm: var TaskManager, id: int): bool =
  if id notin tm.index:
    return false
  let idx = tm.index[id]
  tm.tasks[idx].done = true
  return true

proc findByPriority(tm: TaskManager,
                    priority: Priority): seq[Task] =
  tm.tasks.filterIt(
    it.priority == priority and not it.done
  )

proc search(tm: TaskManager, query: string): seq[Task] =
  let lower = query.toLowerAscii()
  tm.tasks.filterIt(
    lower in it.title.toLowerAscii()
  )

proc sortedByPriority(tm: TaskManager): seq[Task] =
  result = tm.tasks.filterIt(not it.done)
  result.sort do (a, b: Task) -> int:
    cmp(ord(b.priority), ord(a.priority))

template withTransaction(body: untyped) =
  echo "BEGIN"
  try:
    body
    echo "COMMIT"
  except CatchableError:
    echo "ROLLBACK"
    raise

proc summary(tm: TaskManager): Table[string, int] =
  result = initTable[string, int]()
  result["total"] = tm.tasks.len
  result["done"] = tm.tasks.countIt(it.done)
  result["pending"] = tm.tasks.countIt(not it.done)
  for p in Priority:
    result[\$ p] = tm.tasks.countIt(it.priority == p)`,
  },
  {
    id: "sql-windowfunctions",
    language: "SQL",
    languageSlug: "sql",
    project: "Window Functions",
    projectSlug: "windowfunctions",
    description: "Complex queries with window functions and CTEs",
    fileName: "analytics.sql",
    color: "#e38c00",
    code: `WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        category,
        SUM(amount) AS total,
        COUNT(*) AS order_count
    FROM orders
    WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', order_date), category
),

ranked_categories AS (
    SELECT
        month,
        category,
        total,
        order_count,
        ROW_NUMBER() OVER (
            PARTITION BY month
            ORDER BY total DESC
        ) AS rank,
        LAG(total) OVER (
            PARTITION BY category
            ORDER BY month
        ) AS prev_month_total
    FROM monthly_sales
),

growth AS (
    SELECT
        month,
        category,
        total,
        order_count,
        rank,
        CASE
            WHEN prev_month_total IS NULL THEN NULL
            WHEN prev_month_total = 0 THEN NULL
            ELSE ROUND(
                (total - prev_month_total) * 100.0
                / prev_month_total, 2
            )
        END AS growth_pct,
        SUM(total) OVER (
            PARTITION BY category
            ORDER BY month
            ROWS UNBOUNDED PRECEDING
        ) AS running_total,
        AVG(total) OVER (
            PARTITION BY category
            ORDER BY month
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) AS moving_avg_3m
    FROM ranked_categories
)

SELECT
    month,
    category,
    total,
    order_count,
    rank,
    growth_pct,
    running_total,
    ROUND(moving_avg_3m, 2) AS moving_avg_3m,
    ROUND(
        total * 100.0 / SUM(total) OVER (PARTITION BY month),
        2
    ) AS market_share_pct
FROM growth
WHERE rank <= 5
ORDER BY month DESC, rank ASC;`,
  },
  {
    id: "html-semanticform",
    language: "HTML",
    languageSlug: "html",
    project: "Semantic Form",
    projectSlug: "semanticform",
    description: "Semantic markup with forms and accessibility",
    fileName: "registration.html",
    color: "#e34c26",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>Registration</title>
</head>
<body>
    <main>
        <article>
            <header>
                <h1>Create Account</h1>
            </header>
            <form action="/register" method="POST"
                  novalidate aria-label="Registration form">
                <fieldset>
                    <legend>Personal Information</legend>
                    <div>
                        <label for="fullname">Full Name</label>
                        <input type="text" id="fullname"
                               name="fullname" required
                               autocomplete="name"
                               aria-required="true"
                               minlength="2" maxlength="100">
                    </div>
                    <div>
                        <label for="email">Email</label>
                        <input type="email" id="email"
                               name="email" required
                               autocomplete="email"
                               aria-describedby="email-hint">
                        <small id="email-hint">
                            We will never share your email.
                        </small>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Account Settings</legend>
                    <div>
                        <label for="password">Password</label>
                        <input type="password" id="password"
                               name="password" required
                               minlength="8"
                               autocomplete="new-password">
                    </div>
                    <div role="group"
                         aria-labelledby="role-label">
                        <span id="role-label">Role</span>
                        <label>
                            <input type="radio" name="role"
                                   value="user" checked>
                            User
                        </label>
                        <label>
                            <input type="radio" name="role"
                                   value="admin">
                            Admin
                        </label>
                    </div>
                    <div>
                        <label for="bio">Bio</label>
                        <textarea id="bio" name="bio"
                                  rows="4" maxlength="500"
                                  aria-describedby="bio-count">
                        </textarea>
                        <output id="bio-count">0/500</output>
                    </div>
                </fieldset>
                <button type="submit">Create Account</button>
            </form>
        </article>
    </main>
</body>
</html>`,
  },
  {
    id: "erlang-messagepassing",
    language: "Erlang",
    languageSlug: "erlang",
    project: "Message Passing",
    projectSlug: "messagepassing",
    description: "Process spawning, message passing, and gen_server",
    fileName: "kv_store.erl",
    color: "#b83998",
    code: `-module(kv_store).
-behaviour(gen_server).

-export([start_link/0, get/1, put/2, delete/1,
         keys/0, size/0]).
-export([init/1, handle_call/3, handle_cast/2,
         handle_info/2]).

-record(state, {
    store = #{} :: map(),
    hits = 0 :: non_neg_integer(),
    misses = 0 :: non_neg_integer()
}).

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

get(Key) ->
    gen_server:call(?MODULE, {get, Key}).

put(Key, Value) ->
    gen_server:cast(?MODULE, {put, Key, Value}).

delete(Key) ->
    gen_server:cast(?MODULE, {delete, Key}).

keys() ->
    gen_server:call(?MODULE, keys).

size() ->
    gen_server:call(?MODULE, size).

init([]) ->
    {ok, #state{}}.

handle_call({get, Key}, _From, State) ->
    case maps:find(Key, State#state.store) of
        {ok, Value} ->
            NewState = State#state{hits = State#state.hits + 1},
            {reply, {ok, Value}, NewState};
        error ->
            NewState = State#state{
                misses = State#state.misses + 1
            },
            {reply, {error, not_found}, NewState}
    end;
handle_call(keys, _From, State) ->
    Keys = maps:keys(State#state.store),
    {reply, Keys, State};
handle_call(size, _From, State) ->
    Size = maps:size(State#state.store),
    {reply, Size, State}.

handle_cast({put, Key, Value}, State) ->
    NewStore = maps:put(Key, Value, State#state.store),
    {noreply, State#state{store = NewStore}};
handle_cast({delete, Key}, State) ->
    NewStore = maps:remove(Key, State#state.store),
    {noreply, State#state{store = NewStore}}.

handle_info(_Info, State) ->
    {noreply, State}.`,
  },
  {
    id: "groovy-builders",
    language: "Groovy",
    languageSlug: "groovy",
    project: "Builders",
    projectSlug: "builders",
    description: "Closures, builders, and GString templates",
    fileName: "Pipeline.groovy",
    color: "#4298b8",
    code: `class PipelineStage {
    String name
    Closure action
    boolean required = true

    def execute(context) {
        try {
            return action.call(context)
        } catch (Exception e) {
            if (required) throw e
            return context
        }
    }
}

class Pipeline {
    List<PipelineStage> stages = []
    Map<String, Object> context = [:]

    Pipeline stage(String name, Map opts = [:],
                   Closure action) {
        stages << new PipelineStage(
            name: name,
            action: action,
            required: opts.get('required', true)
        )
        return this
    }

    Pipeline with(Map<String, Object> data) {
        context.putAll(data)
        return this
    }

    Map<String, Object> execute() {
        def results = [:]
        def current = context.clone()

        stages.each { stage ->
            def start = System.currentTimeMillis()
            current = stage.execute(current)
            def elapsed = System.currentTimeMillis() - start
            results[stage.name] = [
                status: 'success',
                duration: elapsed
            ]
        }

        return [
            context: current,
            results: results,
            stageCount: stages.size()
        ]
    }
}

class DataTransformer {
    static Pipeline createEtl() {
        new Pipeline()
            .stage('extract') { ctx ->
                ctx.records = ctx.source.collect { row ->
                    row.collectEntries { k, v ->
                        [(k.toLowerCase()): v]
                    }
                }
                ctx
            }
            .stage('transform') { ctx ->
                ctx.records = ctx.records.findAll { rec ->
                    rec.values().every { it != null }
                }
                ctx.recordCount = ctx.records.size()
                ctx
            }
            .stage('validate', required: false) { ctx ->
                ctx.valid = ctx.records.every { rec ->
                    rec.containsKey('id') &&
                    rec.id?.toString()?.isNumber()
                }
                ctx
            }
    }
}`,
  },
  {
    id: "objectivec-protocols",
    language: "Objective-C",
    languageSlug: "objectivec",
    project: "Protocols",
    projectSlug: "protocols",
    description: "Message passing, protocols, and blocks",
    fileName: "TaskQueue.m",
    color: "#438eff",
    code: `#import <Foundation/Foundation.h>

@protocol TaskQueueDelegate <NSObject>
@required
- (void)taskQueue:(id)queue didCompleteTask:(NSString *)taskId;
@optional
- (void)taskQueue:(id)queue didFailTask:(NSString *)taskId
           error:(NSError *)error;
@end

typedef void (^TaskBlock)(void (^completion)(BOOL success));

@interface TaskQueue : NSObject

@property (nonatomic, weak) id<TaskQueueDelegate> delegate;
@property (nonatomic, readonly) NSUInteger pendingCount;
@property (nonatomic, assign) NSUInteger maxConcurrent;

- (void)enqueue:(NSString *)taskId block:(TaskBlock)block;
- (void)cancelAll;

@end

@implementation TaskQueue {
    NSMutableDictionary<NSString *, TaskBlock> *_tasks;
    NSMutableSet<NSString *> *_running;
    dispatch_queue_t _queue;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _tasks = [NSMutableDictionary new];
        _running = [NSMutableSet new];
        _maxConcurrent = 4;
        _queue = dispatch_queue_create(
            "com.app.taskqueue",
            DISPATCH_QUEUE_CONCURRENT
        );
    }
    return self;
}

- (NSUInteger)pendingCount {
    return [_tasks count];
}

- (void)enqueue:(NSString *)taskId block:(TaskBlock)block {
    @synchronized (self) {
        _tasks[taskId] = [block copy];
    }
    [self processNext];
}

- (void)processNext {
    @synchronized (self) {
        if ([_running count] >= _maxConcurrent) return;
        NSString *nextId = [[_tasks allKeys] firstObject];
        if (!nextId) return;
        TaskBlock block = _tasks[nextId];
        [_tasks removeObjectForKey:nextId];
        [_running addObject:nextId];
        dispatch_async(_queue, ^{
            block(^(BOOL success) {
                @synchronized (self) {
                    [self->_running removeObject:nextId];
                }
                if (success) {
                    [self.delegate taskQueue:self
                            didCompleteTask:nextId];
                }
                [self processNext];
            });
        });
    }
}

- (void)cancelAll {
    @synchronized (self) {
        [_tasks removeAllObjects];
    }
}

@end`,
  },
  {
    id: "assembly-syscalls",
    language: "Assembly",
    languageSlug: "assembly",
    project: "System Calls",
    projectSlug: "syscalls",
    description: "x86_64 system calls, registers, and stack frames",
    fileName: "string_ops.asm",
    color: "#6e4c13",
    code: `section .data
    newline db 10

section .bss
    buffer resb 256

section .text
    global _start

strlen:
    xor rcx, rcx
.loop:
    cmp byte [rdi + rcx], 0
    je .done
    inc rcx
    jmp .loop
.done:
    mov rax, rcx
    ret

write_stdout:
    push rbp
    mov rbp, rsp
    push rdi
    call strlen
    pop rdi
    mov rdx, rax
    mov rsi, rdi
    mov rdi, 1
    mov rax, 1
    syscall
    mov rsi, newline
    mov rdx, 1
    mov rdi, 1
    mov rax, 1
    syscall
    pop rbp
    ret

strcopy:
    xor rcx, rcx
.copy_loop:
    mov al, [rsi + rcx]
    mov [rdi + rcx], al
    test al, al
    jz .copy_done
    inc rcx
    jmp .copy_loop
.copy_done:
    mov rax, rcx
    ret

to_upper:
    xor rcx, rcx
.upper_loop:
    mov al, [rdi + rcx]
    test al, al
    jz .upper_done
    cmp al, 'a'
    jb .upper_next
    cmp al, 'z'
    ja .upper_next
    sub al, 32
    mov [rdi + rcx], al
.upper_next:
    inc rcx
    jmp .upper_loop
.upper_done:
    ret

reverse_string:
    push rbp
    mov rbp, rsp
    call strlen
    dec rax
    xor rcx, rcx
.rev_loop:
    cmp rcx, rax
    jge .rev_done
    mov dl, [rdi + rcx]
    mov bl, [rdi + rax]
    mov [rdi + rcx], bl
    mov [rdi + rax], dl
    inc rcx
    dec rax
    jmp .rev_loop
.rev_done:
    pop rbp
    ret

_start:
    mov rdi, 0
    mov rax, 60
    syscall`,
  },
  {
    id: "cobol-businesslogic",
    language: "COBOL",
    languageSlug: "cobol",
    project: "Business Logic",
    projectSlug: "businesslogic",
    description: "Business logic with file handling and divisions",
    fileName: "PAYROLL.cbl",
    color: "#4c6c8c",
    code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYROLL-CALC.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-EMPLOYEE.
          05 EMP-ID          PIC 9(6).
          05 EMP-NAME         PIC X(30).
          05 EMP-HOURS        PIC 9(3)V9.
          05 EMP-RATE         PIC 9(4)V99.
          05 EMP-DEPARTMENT   PIC X(10).

       01 WS-PAYROLL.
          05 REGULAR-PAY      PIC 9(7)V99.
          05 OVERTIME-PAY     PIC 9(7)V99.
          05 GROSS-PAY        PIC 9(7)V99.
          05 TAX-AMOUNT       PIC 9(7)V99.
          05 NET-PAY          PIC 9(7)V99.

       01 WS-TOTALS.
          05 TOTAL-GROSS      PIC 9(9)V99 VALUE 0.
          05 TOTAL-TAX        PIC 9(9)V99 VALUE 0.
          05 TOTAL-NET        PIC 9(9)V99 VALUE 0.
          05 EMPLOYEE-COUNT   PIC 9(5) VALUE 0.

       01 WS-TAX-BRACKETS.
          05 BRACKET-1-LIMIT  PIC 9(7)V99 VALUE 50000.00.
          05 BRACKET-1-RATE   PIC V99 VALUE .15.
          05 BRACKET-2-LIMIT  PIC 9(7)V99 VALUE 100000.00.
          05 BRACKET-2-RATE   PIC V99 VALUE .25.
          05 BRACKET-3-RATE   PIC V99 VALUE .35.

       PROCEDURE DIVISION.
       MAIN-PARA.
           PERFORM CALCULATE-PAY
           PERFORM CALCULATE-TAX
           PERFORM UPDATE-TOTALS
           STOP RUN.

       CALCULATE-PAY.
           IF EMP-HOURS > 40
               COMPUTE REGULAR-PAY =
                   40 * EMP-RATE
               COMPUTE OVERTIME-PAY =
                   (EMP-HOURS - 40) * EMP-RATE * 1.5
           ELSE
               COMPUTE REGULAR-PAY =
                   EMP-HOURS * EMP-RATE
               MOVE 0 TO OVERTIME-PAY
           END-IF
           ADD REGULAR-PAY TO OVERTIME-PAY
               GIVING GROSS-PAY.

       CALCULATE-TAX.
           EVALUATE TRUE
               WHEN GROSS-PAY <= BRACKET-1-LIMIT
                   COMPUTE TAX-AMOUNT =
                       GROSS-PAY * BRACKET-1-RATE
               WHEN GROSS-PAY <= BRACKET-2-LIMIT
                   COMPUTE TAX-AMOUNT =
                       GROSS-PAY * BRACKET-2-RATE
               WHEN OTHER
                   COMPUTE TAX-AMOUNT =
                       GROSS-PAY * BRACKET-3-RATE
           END-EVALUATE
           SUBTRACT TAX-AMOUNT FROM GROSS-PAY
               GIVING NET-PAY.

       UPDATE-TOTALS.
           ADD GROSS-PAY TO TOTAL-GROSS
           ADD TAX-AMOUNT TO TOTAL-TAX
           ADD NET-PAY TO TOTAL-NET
           ADD 1 TO EMPLOYEE-COUNT.`,
  },
  {
    id: "fortran-scientific",
    language: "Fortran",
    languageSlug: "fortran",
    project: "Scientific Computing",
    projectSlug: "scientific",
    description: "Scientific computing with arrays and modules",
    fileName: "matrix_ops.f90",
    color: "#4d41b1",
    code: `module matrix_ops
    implicit none

    type :: Matrix
        integer :: rows, cols
        real(8), allocatable :: data(:,:)
    end type Matrix

contains

    function create_matrix(rows, cols) result(m)
        integer, intent(in) :: rows, cols
        type(Matrix) :: m
        m%rows = rows
        m%cols = cols
        allocate(m%data(rows, cols))
        m%data = 0.0d0
    end function

    function mat_multiply(a, b) result(c)
        type(Matrix), intent(in) :: a, b
        type(Matrix) :: c
        integer :: i, j, k
        c = create_matrix(a%rows, b%cols)
        do j = 1, b%cols
            do k = 1, a%cols
                do i = 1, a%rows
                    c%data(i,j) = c%data(i,j) &
                        + a%data(i,k) * b%data(k,j)
                end do
            end do
        end do
    end function

    function trace(m) result(t)
        type(Matrix), intent(in) :: m
        real(8) :: t
        integer :: i
        t = 0.0d0
        do i = 1, min(m%rows, m%cols)
            t = t + m%data(i,i)
        end do
    end function

    function frobenius_norm(m) result(norm)
        type(Matrix), intent(in) :: m
        real(8) :: norm
        norm = sqrt(sum(m%data**2))
    end function

    subroutine transpose_inplace(m)
        type(Matrix), intent(inout) :: m
        type(Matrix) :: temp
        integer :: i, j
        temp = create_matrix(m%cols, m%rows)
        do i = 1, m%rows
            do j = 1, m%cols
                temp%data(j,i) = m%data(i,j)
            end do
        end do
        deallocate(m%data)
        m%rows = temp%rows
        m%cols = temp%cols
        m%data = temp%data
    end subroutine

    function identity(n) result(m)
        integer, intent(in) :: n
        type(Matrix) :: m
        integer :: i
        m = create_matrix(n, n)
        do i = 1, n
            m%data(i,i) = 1.0d0
        end do
    end function

end module matrix_ops`,
  },
  {
    id: "prolog-logicprogramming",
    language: "Prolog",
    languageSlug: "prolog",
    project: "Logic Programming",
    projectSlug: "logicprogramming",
    description: "Facts, rules, and logical queries",
    fileName: "family.pl",
    color: "#74283c",
    code: `parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).
parent(pat, jim).
parent(pat, eve).

female(liz).
female(ann).
female(pat).
female(eve).
male(tom).
male(bob).
male(jim).

mother(X, Y) :- parent(X, Y), female(X).
father(X, Y) :- parent(X, Y), male(X).

sibling(X, Y) :-
    parent(Z, X),
    parent(Z, Y),
    X \\= Y.

grandparent(X, Z) :-
    parent(X, Y),
    parent(Y, Z).

ancestor(X, Y) :- parent(X, Y).
ancestor(X, Y) :-
    parent(X, Z),
    ancestor(Z, Y).

descendant(X, Y) :- ancestor(Y, X).

cousin(X, Y) :-
    parent(PX, X),
    parent(PY, Y),
    sibling(PX, PY).

uncle(X, Y) :-
    male(X),
    sibling(X, P),
    parent(P, Y).

generation(X, X, 0).
generation(X, Y, N) :-
    parent(X, Z),
    generation(Z, Y, N1),
    N is N1 + 1.

common_ancestor(X, Y, A) :-
    ancestor(A, X),
    ancestor(A, Y).

list_length([], 0).
list_length([_|T], N) :-
    list_length(T, N1),
    N is N1 + 1.

list_member(X, [X|_]).
list_member(X, [_|T]) :- list_member(X, T).

list_append([], L, L).
list_append([H|T], L, [H|R]) :-
    list_append(T, L, R).

list_reverse([], []).
list_reverse([H|T], R) :-
    list_reverse(T, Rev),
    list_append(Rev, [H], R).`,
  },
  {
    id: "scheme-lambdacalculus",
    language: "Scheme",
    languageSlug: "scheme",
    project: "Lambda Calculus",
    projectSlug: "lambdacalculus",
    description: "Lambda calculus, continuations, and tail recursion",
    fileName: "evaluator.scm",
    color: "#1e4aec",
    code: `(define (make-env) '())

(define (extend-env name value env)
  (cons (cons name value) env))

(define (lookup-env name env)
  (cond
    ((null? env) (error "Unbound variable" name))
    ((eq? (caar env) name) (cdar env))
    (else (lookup-env name (cdr env)))))

(define (eval-expr expr env)
  (cond
    ((number? expr) expr)
    ((string? expr) expr)
    ((symbol? expr) (lookup-env expr env))
    ((eq? (car expr) 'quote) (cadr expr))
    ((eq? (car expr) 'if)
     (if (eval-expr (cadr expr) env)
         (eval-expr (caddr expr) env)
         (eval-expr (cadddr expr) env)))
    ((eq? (car expr) 'lambda)
     (list 'closure (cadr expr) (caddr expr) env))
    ((eq? (car expr) 'let)
     (let* ((bindings (cadr expr))
            (body (caddr expr))
            (new-env
              (fold-left
                (lambda (e binding)
                  (extend-env
                    (car binding)
                    (eval-expr (cadr binding) env)
                    e))
                env
                bindings)))
       (eval-expr body new-env)))
    (else (apply-proc
            (eval-expr (car expr) env)
            (map (lambda (arg)
                   (eval-expr arg env))
                 (cdr expr))))))

(define (apply-proc proc args)
  (cond
    ((and (list? proc) (eq? (car proc) 'closure))
     (let ((params (cadr proc))
           (body (caddr proc))
           (closed-env (cadddr proc)))
       (let ((new-env
               (fold-left
                 (lambda (env pair)
                   (extend-env (car pair) (cdr pair) env))
                 closed-env
                 (map cons params args))))
         (eval-expr body new-env))))
    ((procedure? proc) (apply proc args))
    (else (error "Not a procedure" proc))))

(define (fold-left f init lst)
  (if (null? lst)
      init
      (fold-left f (f init (car lst)) (cdr lst))))

(define (fold-right f init lst)
  (if (null? lst)
      init
      (f (car lst) (fold-right f init (cdr lst)))))

(define (my-map f lst)
  (fold-right (lambda (x acc) (cons (f x) acc))
              '()
              lst))

(define (my-filter pred lst)
  (fold-right (lambda (x acc)
                (if (pred x) (cons x acc) acc))
              '()
              lst))`,
  },
  {
    id: "ada-tasking",
    language: "Ada",
    languageSlug: "ada",
    project: "Tasking",
    projectSlug: "tasking",
    description: "Tasking, strong typing, and packages",
    fileName: "bounded_buffer.adb",
    color: "#02f88c",
    code: `with Ada.Text_IO; use Ada.Text_IO;

package body Bounded_Buffer is

   type Item_Array is array (Positive range <>) of Item_Type;

   protected type Buffer (Capacity : Positive) is
      entry Put (Item : in Item_Type);
      entry Get (Item : out Item_Type);
      function Count return Natural;
      function Is_Full return Boolean;
      function Is_Empty return Boolean;
   private
      Store : Item_Array (1 .. Capacity);
      Head  : Positive := 1;
      Tail  : Positive := 1;
      Size  : Natural := 0;
   end Buffer;

   protected body Buffer is

      entry Put (Item : in Item_Type)
         when Size < Capacity is
      begin
         Store (Tail) := Item;
         Tail := (Tail mod Capacity) + 1;
         Size := Size + 1;
      end Put;

      entry Get (Item : out Item_Type)
         when Size > 0 is
      begin
         Item := Store (Head);
         Head := (Head mod Capacity) + 1;
         Size := Size - 1;
      end Get;

      function Count return Natural is
      begin
         return Size;
      end Count;

      function Is_Full return Boolean is
      begin
         return Size = Capacity;
      end Is_Full;

      function Is_Empty return Boolean is
      begin
         return Size = 0;
      end Is_Empty;

   end Buffer;

   task type Producer (Buf : access Buffer; Id : Positive);
   task type Consumer (Buf : access Buffer; Id : Positive);

   task body Producer is
      Value : Item_Type;
   begin
      for I in 1 .. 10 loop
         Value := Item_Type'Val (I + Id * 100);
         Buf.Put (Value);
         Put_Line ("Producer" & Id'Image &
                   " put item" & I'Image);
      end loop;
   end Producer;

   task body Consumer is
      Value : Item_Type;
   begin
      for I in 1 .. 10 loop
         Buf.Get (Value);
         Put_Line ("Consumer" & Id'Image &
                   " got item" & I'Image);
      end loop;
   end Consumer;

end Bounded_Buffer;`,
  },
  {
    id: "pascal-records",
    language: "Pascal",
    languageSlug: "pascal",
    project: "Records",
    projectSlug: "records",
    description: "Records, procedures, and file I/O",
    fileName: "inventory.pas",
    color: "#e3f171",
    code: `program Inventory;

type
    TProduct = record
        Id: Integer;
        Name: string[50];
        Price: Real;
        Quantity: Integer;
    end;

    TInventory = record
        Items: array[1..100] of TProduct;
        Count: Integer;
    end;

var
    Inv: TInventory;

procedure InitInventory(var I: TInventory);
begin
    I.Count := 0;
end;

function AddProduct(var I: TInventory;
    AName: string; APrice: Real;
    AQty: Integer): Boolean;
begin
    if I.Count >= 100 then
    begin
        AddProduct := False;
        Exit;
    end;
    Inc(I.Count);
    with I.Items[I.Count] do
    begin
        Id := I.Count;
        Name := AName;
        Price := APrice;
        Quantity := AQty;
    end;
    AddProduct := True;
end;

function FindProduct(var I: TInventory;
    AName: string): Integer;
var
    Idx: Integer;
begin
    FindProduct := -1;
    for Idx := 1 to I.Count do
        if I.Items[Idx].Name = AName then
        begin
            FindProduct := Idx;
            Exit;
        end;
end;

function TotalValue(var I: TInventory): Real;
var
    Idx: Integer;
    Total: Real;
begin
    Total := 0.0;
    for Idx := 1 to I.Count do
        Total := Total +
            I.Items[Idx].Price * I.Items[Idx].Quantity;
    TotalValue := Total;
end;

procedure SortByPrice(var I: TInventory);
var
    J, K: Integer;
    Temp: TProduct;
begin
    for J := 1 to I.Count - 1 do
        for K := J + 1 to I.Count do
            if I.Items[J].Price > I.Items[K].Price then
            begin
                Temp := I.Items[J];
                I.Items[J] := I.Items[K];
                I.Items[K] := Temp;
            end;
end;

procedure SaveToFile(var I: TInventory;
    FileName: string);
var
    F: TextFile;
    Idx: Integer;
begin
    Assign(F, FileName);
    Rewrite(F);
    WriteLn(F, I.Count);
    for Idx := 1 to I.Count do
        with I.Items[Idx] do
            WriteLn(F, Id, '|', Name, '|',
                Price:0:2, '|', Quantity);
    Close(F);
end;

begin
    InitInventory(Inv);
    AddProduct(Inv, 'Widget', 9.99, 50);
    AddProduct(Inv, 'Gadget', 24.95, 30);
    SortByPrice(Inv);
    SaveToFile(Inv, 'inventory.dat');
end.`,
  },
  {
    id: "matlab-matrixops",
    language: "MATLAB",
    languageSlug: "matlab",
    project: "Matrix Operations",
    projectSlug: "matrixops",
    description: "Matrix operations, signal processing, and plotting",
    fileName: "signal_analysis.m",
    color: "#e16737",
    code: `function results = signal_analysis(signal, fs)
    N = length(signal);
    t = (0:N-1) / fs;

    results.time = t;
    results.signal = signal;

    results.mean = mean(signal);
    results.rms = sqrt(mean(signal.^2));
    results.peak = max(abs(signal));
    results.crest_factor = results.peak / results.rms;

    Y = fft(signal);
    P2 = abs(Y / N);
    P1 = P2(1:N/2+1);
    P1(2:end-1) = 2 * P1(2:end-1);
    f = fs * (0:(N/2)) / N;

    results.freq = f;
    results.spectrum = P1;

    [~, idx] = max(P1(2:end));
    results.dominant_freq = f(idx + 1);

    window_size = round(fs * 0.05);
    b = ones(1, window_size) / window_size;
    results.smoothed = filter(b, 1, signal);

    band_low = 100;
    band_high = 1000;
    mask = (f >= band_low) & (f <= band_high);
    results.band_energy = sum(P1(mask).^2);
    results.total_energy = sum(P1.^2);
    results.band_ratio = results.band_energy ...
        / results.total_energy;

    frame_len = round(fs * 0.025);
    frame_hop = round(fs * 0.010);
    num_frames = floor((N - frame_len) / frame_hop) + 1;
    results.envelope = zeros(1, num_frames);

    for i = 1:num_frames
        start_idx = (i-1) * frame_hop + 1;
        end_idx = start_idx + frame_len - 1;
        frame = signal(start_idx:end_idx);
        results.envelope(i) = sqrt(mean(frame.^2));
    end

    threshold = 0.1 * results.peak;
    crossings = find(diff(sign(signal - threshold)));
    if length(crossings) >= 2
        periods = diff(crossings) / fs;
        results.avg_period = mean(periods);
    else
        results.avg_period = 0;
    end
end`,
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
