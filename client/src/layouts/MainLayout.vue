<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white p-4">
      <h1 class="text-lg font-bold mb-4">Link Manager</h1>
      <nav class="space-y-2">
        <RouterLink to="/" class="block hover:bg-gray-700 p-2 rounded">Dashboard</RouterLink>
        <RouterLink to="/create" class="block hover:bg-gray-700 p-2 rounded"
          >Create Link</RouterLink
        >
        <RouterLink to="/settings" class="block hover:bg-gray-700 p-2 rounded">Settings</RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
