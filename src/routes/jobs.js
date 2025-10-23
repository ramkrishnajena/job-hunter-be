import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getPagination } from "../utils/pagination";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      company = "",
      location = "",
      tag = "",
      sort = "newest",
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Number.parseInt(page);
    const limitNum = Number.parseInt(limit);
    const { skip, take } = getPagination(pageNum, limitNum);

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        company ? { company: { contains: company, mode: "insensitive" } } : {},
        location
          ? { location: { contains: location, mode: "insensitive" } }
          : {},
        tag ? { tags: { contains: tag, mode: "insensitive" } } : {},
      ],
    };

    const orderBy =
      sort === "company"
        ? { company: "asc" }
        : sort === "oldest"
        ? { postedAt: "asc" }
        : { postedAt: "desc" };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      jobs,
      total,
      currentPage: pageNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;
