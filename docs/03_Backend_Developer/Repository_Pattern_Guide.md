# Repository Pattern Implementation Guide
**Role:** Backend Developer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. What is the Repository Pattern?
In our Domain-Driven Design (DDD) architecture, the Repository acts as the bridge between the business logic (Services) and the data source (Database/Eloquent). 
- **Goal:** To decouple the database querying logic from the Service classes. If we ever need to change how data is retrieved (e.g., from PostgreSQL to an external API), we only change the Repository.

---

## 2. Core Rules (Strict Enforcement)
1. **NO Business Logic:** A repository must NEVER contain business logic (e.g., `if ($qty > 50)`). It only fetches, creates, updates, or deletes data.
2. **Prevent N+1 Queries:** Always use Eager Loading (`with()`) in the repository if you are fetching related tables.
3. **Dependency Injection:** Repositories must be injected into Services via their Interfaces.

---

## 3. Code Implementation Example

### 3.1. The Base Interface
Create a base interface that all repositories must implement.
**Path:** `app/Support/Repositories/RepositoryInterface.php`

```php
<?php
namespace App\Support\Repositories;

interface RepositoryInterface
{
    public function all(array $relations = []);
    public function find($id, array $relations = []);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
```

### 3.2. Concrete Repository (e.g., Single Piece QR)
**Path:** `app/Domains/Cutting/Repositories/SinglePieceRepository.php`

```php
<?php
namespace App\Domains\Cutting\Repositories;

use App\Support\Repositories\RepositoryInterface;
use App\Domains\Cutting\Models\SinglePieceQr;

class SinglePieceRepository implements RepositoryInterface
{
    protected $model;

    public function __construct(SinglePieceQr $model)
    {
        $this->model = $model;
    }

    public function all(array $relations = [])
    {
        // Eager load relations to prevent N+1 issues
        return $this->model->with($relations)->get();
    }

    public function find($id, array $relations = [])
    {
        return $this->model->with($relations)->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $record = $this->find($id);
        $record->update($data);
        return $record;
    }

    public function delete($id)
    {
        return $this->find($id)->delete();
    }
    
    // Custom query specific to this domain
    public function getPendingPiecesByBundle($bundleId)
    {
        return $this->model->where('bundle_id', $bundleId)
                           ->where('status', 'Pending')
                           ->get();
    }
}
```

### 3.3. Usage in a Service Class
**Path:** `app/Domains/QC/Services/QCScannerService.php`

```php
<?php
namespace App\Domains\QC\Services;

use App\Domains\Cutting\Repositories\SinglePieceRepository;
use Exception;

class QCScannerService
{
    protected $qrRepository;

    // Inject the Repository
    public function __construct(SinglePieceRepository $qrRepository)
    {
        $this->qrRepository = $qrRepository;
    }

    public function processScan(string $qrCodeId, string $defectType = null)
    {
        // 1. Fetch data via Repository (No DB::table calls here)
        $piece = $this->qrRepository->find($qrCodeId);

        // 2. Business Logic
        if ($piece->status === 'Reject') {
            throw new Exception("This piece is already rejected.", 422);
        }

        // 3. Update via Repository
        $status = $defectType ? 'Reject' : 'QC_Pass';
        return $this->qrRepository->update($piece->id, ['status' => $status]);
    }
}
```

---
*(End of Repository Guide)*
